import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { WhatsAppIcon } from '../components/icons/Icons'
import Seo from '../components/seo/Seo'
import { apiClient } from '../api/client'

export default function TrackOrder() {
  const [searchParams] = useSearchParams()
  const initialId = searchParams.get('orderId') || ''
  const [orderQuery, setOrderQuery] = useState(initialId)
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Live status from Delhivery (via our backend). The AWB / tracking number is sent to the customer
  // by SMS / email once the parcel is dispatched.
  const performTracking = async (query) => {
    const awb = (query || '').trim().replace(/\s+/g, '')
    if (!awb) return
    if (!/^[A-Za-z0-9-]{6,30}$/.test(awb)) {
      setTrackingData(null)
      setError('Please enter a valid tracking number (AWB) — letters and digits only.')
      return
    }
    setError('')
    setTrackingData(null)
    setLoading(true)
    try {
      const res = await apiClient.get(`/shipping/track/${encodeURIComponent(awb)}`)
      const r = res.data
      if (r?.found) {
        setTrackingData(r)
      } else if (r?.configured === false) {
        setError('Live tracking is temporarily unavailable. Please contact us and we will share your order status.')
      } else {
        setError(
          'We could not find this tracking number yet. It can take a few hours after dispatch to show up — please check the number, or contact us.'
        )
      }
    } catch (err) {
      setError(err.message || 'Could not fetch tracking right now. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialId) {
      performTracking(initialId)
    }
  }, [initialId])

  const handleTrack = (e) => {
    e.preventDefault()
    if (!orderQuery.trim()) {
      setError('Please enter your tracking number (AWB)')
      return
    }
    performTracking(orderQuery)
  }

  const formatTime = (value) => {
    if (!value) return ''
    const d = new Date(value)
    return Number.isNaN(d.getTime())
      ? value
      : d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <Seo title="Track Your Order" description="Track your Vinit Textiles saree order using your Order ID, AWB or mobile number." noindex />
      <div className="container-ambika max-w-3xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Live Courier Tracking</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-2">
            Enter the tracking number (AWB) we sent you by SMS / email after dispatch to see your parcel's live status.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label htmlFor="orderQuery" className="block text-xs font-bold uppercase tracking-wider text-[#4A1D1B] mb-1.5">
                Tracking Number (AWB)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="orderQuery"
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="e.g. 1234567890123"
                  className="flex-1 rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-4 py-3 text-sm text-[#332421] placeholder:text-[#9F8A84] focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-sm bg-[#801B1A] px-7 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#681312] transition-colors disabled:opacity-50 shrink-0"
                >
                  {loading ? 'Locating...' : 'Track Package'}
                </button>
              </div>
              {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
            </div>
            <p className="text-[11px] text-[#8C7570]">
              *Your tracking number is sent by SMS and email as soon as your order is handed to our courier partner, Delhivery.
            </p>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs mb-8 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0E6E0] pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C44331] bg-[#FFEAE5] px-2.5 py-1 rounded-full">
                  Status: {trackingData.status || 'Processing'}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#4A1D1B] mt-2">
                  Shipment {trackingData.awb}
                </h3>
                <p className="text-xs text-[#7A615C]">
                  Courier: <strong>Delhivery</strong>
                  {trackingData.location ? ` | Last seen: ${trackingData.location}` : ''}
                </p>
                {trackingData.updatedAt && <p className="text-[11px] text-[#8A726E] mt-0.5">Updated {formatTime(trackingData.updatedAt)}</p>}
              </div>
              {trackingData.expectedDelivery && (
                <div className="text-left sm:text-right">
                  <p className="text-xs text-[#8A726E]">Expected Delivery</p>
                  <p className="font-serif text-lg font-bold text-[#4A1D1B]">{formatTime(trackingData.expectedDelivery).replace(/, \d{1,2}:\d{2}.*$/, '')}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="py-8">
              <div className="relative border-l-2 border-[#EADFD8] ml-4 sm:ml-6 space-y-6">
                {trackingData.scans.length === 0 && (
                  <p className="pl-6 text-xs text-[#78615C]">No scan updates yet — check back in a few hours.</p>
                )}
                {trackingData.scans.map((scan, idx) => (
                  <div key={idx} className="relative pl-6 sm:pl-8">
                    {/* Bullet — newest scan is highlighted */}
                    <div
                      className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                        idx === 0 ? 'bg-[#C44331] ring-4 ring-[#FFEAE5]' : 'bg-[#1E7E34]'
                      }`}
                    />
                    <div>
                      <p className={`text-xs sm:text-sm font-bold ${idx === 0 ? 'text-[#C44331]' : 'text-[#1E7E34]'}`}>
                        {scan.status}
                      </p>
                      <p className="text-[11px] text-[#78615C] mt-0.5">
                        {[scan.location, formatTime(scan.time)].filter(Boolean).join(' · ')}
                      </p>
                      {scan.note && <p className="text-[11px] text-[#8A7570] mt-0.5">{scan.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assistance Card */}
        <div className="bg-[#FFF4F0] rounded-xl border border-[#F5D5CE] p-6 text-center space-y-3">
          <h3 className="font-serif text-base font-bold text-[#4A1D1B]">
            Having Trouble Locating Your Order?
          </h3>
          <p className="text-xs text-[#735A55] max-w-md mx-auto">
            Our customer care team in Surat is available Monday to Saturday, 10 AM – 7 PM IST to assist you directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/919876543210?text=Hi%20Vinit%20Textiles,%20I%20need%20help%20tracking%20my%20order"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#20BA5A] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp Support
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-sm border border-[#801B1A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#801B1A] hover:bg-[#801B1A]/5 transition-colors"
            >
              Contact Helpdesk
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
