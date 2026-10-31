import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { ShippingService } from './shipping.service';

export class ShippingController {
  constructor(private readonly shippingService: ShippingService = new ShippingService()) {}

  serviceability = async (req: Request, res: Response): Promise<void> => {
    const result = await this.shippingService.checkPincode(req.params.pincode);
    ApiResponse.success(res, 'Pincode checked', result);
  };

  track = async (req: Request, res: Response): Promise<void> => {
    const result = await this.shippingService.track(req.params.awb);
    ApiResponse.success(res, 'Tracking fetched', result);
  };
}
