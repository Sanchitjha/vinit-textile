import { env } from '../../config/env';
import { logger } from '../../shared/utils/logger.util';

export interface ServiceabilityResult {
  /** false when no Delhivery token is configured — callers should fall back to the generic estimate. */
  configured: boolean;
  pincode: string;
  /** null = unknown (not configured, or Delhivery unreachable). */
  serviceable: boolean | null;
  cod: boolean;
  prepaid: boolean;
  city: string | null;
  state: string | null;
  remote: boolean;
  /** Business days in transit after dispatch (dispatch itself takes 24–48 hrs). */
  transitDays: { min: number; max: number } | null;
}

export interface TrackingScan {
  status: string;
  location: string;
  time: string;
  note: string;
}

export interface TrackingResult {
  configured: boolean;
  found: boolean;
  awb: string;
  status: string | null;
  location: string | null;
  updatedAt: string | null;
  expectedDelivery: string | null;
  origin: string | null;
  destination: string | null;
  scans: TrackingScan[];
}

const METRO_CITIES = ['mumbai', 'delhi', 'new delhi', 'bengaluru', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'surat'];
const SERVICEABILITY_TTL_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8000;

const serviceabilityCache = new Map<string, { at: number; value: ServiceabilityResult }>();

async function delhiveryGet(path: string): Promise<unknown> {
  const res = await fetch(`${env.delhivery.baseUrl}${path}`, {
    headers: { Authorization: `Token ${env.delhivery.apiToken}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Delhivery responded ${res.status}`);
  return res.json();
}

export class ShippingService {
  async checkPincode(pincode: string): Promise<ServiceabilityResult> {
    const empty: ServiceabilityResult = {
      configured: env.delhivery.isConfigured,
      pincode,
      serviceable: null,
      cod: false,
      prepaid: false,
      city: null,
      state: null,
      remote: false,
      transitDays: null,
    };
    if (!env.delhivery.isConfigured) return empty;

    const cached = serviceabilityCache.get(pincode);
    if (cached && Date.now() - cached.at < SERVICEABILITY_TTL_MS) return cached.value;

    try {
      const data = (await delhiveryGet(`/c/api/pin-codes/json/?filter_codes=${pincode}`)) as {
        delivery_codes?: Array<{ postal_code?: Record<string, unknown> }>;
      };
      const entry = data.delivery_codes?.[0]?.postal_code;
      let result: ServiceabilityResult;
      if (!entry) {
        result = { ...empty, serviceable: false };
      } else {
        const prepaid = entry.pre_paid === 'Y';
        const cod = entry.cod === 'Y';
        const remote = entry.is_oda === 'Y';
        const city = typeof entry.district === 'string' ? entry.district : null;
        const metro = city ? METRO_CITIES.includes(city.toLowerCase()) : false;
        const base = metro ? { min: 3, max: 4 } : { min: 5, max: 7 };
        result = {
          ...empty,
          serviceable: prepaid || cod,
          cod,
          prepaid,
          city,
          state: typeof entry.state_code === 'string' ? entry.state_code : null,
          remote,
          transitDays: remote ? { min: base.min + 2, max: base.max + 3 } : base,
        };
      }
      serviceabilityCache.set(pincode, { at: Date.now(), value: result });
      return result;
    } catch (err) {
      logger.warn(`[shipping] pincode check failed for ${pincode}: ${(err as Error).message}`);
      return empty; // serviceable: null → the UI shows the generic estimate
    }
  }

  async track(awb: string): Promise<TrackingResult> {
    const empty: TrackingResult = {
      configured: env.delhivery.isConfigured,
      found: false,
      awb,
      status: null,
      location: null,
      updatedAt: null,
      expectedDelivery: null,
      origin: null,
      destination: null,
      scans: [],
    };
    if (!env.delhivery.isConfigured) return empty;

    try {
      const data = (await delhiveryGet(`/api/v1/packages/json/?waybill=${encodeURIComponent(awb)}`)) as {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ShipmentData?: Array<{ Shipment?: any }>;
      };
      const shipment = data.ShipmentData?.[0]?.Shipment;
      if (!shipment) return empty;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scans: TrackingScan[] = (shipment.Scans || []).map((s: any) => {
        const d = s.ScanDetail || {};
        return {
          status: String(d.Scan || d.Status || ''),
          location: String(d.ScannedLocation || ''),
          time: String(d.ScanDateTime || d.StatusDateTime || ''),
          note: String(d.Instructions || ''),
        };
      });
      scans.reverse(); // newest first

      return {
        ...empty,
        found: true,
        status: shipment.Status?.Status ?? null,
        location: shipment.Status?.StatusLocation ?? null,
        updatedAt: shipment.Status?.StatusDateTime ?? null,
        expectedDelivery: shipment.ExpectedDeliveryDate ?? shipment.PromisedDeliveryDate ?? null,
        origin: shipment.Origin ?? null,
        destination: shipment.Destination ?? null,
        scans,
      };
    } catch (err) {
      logger.warn(`[shipping] tracking failed for ${awb}: ${(err as Error).message}`);
      return empty;
    }
  }
}
