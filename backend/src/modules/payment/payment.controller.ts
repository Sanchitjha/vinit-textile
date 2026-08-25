import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { PaymentService } from './payment.service';
import { VerifyPaymentDtoType } from './payment.dto';

export class PaymentController {
  constructor(private readonly paymentService: PaymentService = new PaymentService()) {}

  initiate = async (req: Request, res: Response): Promise<void> => {
    const result = await this.paymentService.initiate(req.user!.id, req.params.orderId);
    ApiResponse.success(res, 'Payment initiated successfully', result, 201);
  };

  verify = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as VerifyPaymentDtoType;
    const payment = await this.paymentService.verify(req.user!.id, dto);
    ApiResponse.success(res, 'Payment verified successfully', payment);
  };

  refund = async (req: Request, res: Response): Promise<void> => {
    const payment = await this.paymentService.refund(req.params.orderId);
    ApiResponse.success(res, 'Payment refunded successfully', payment);
  };
}
