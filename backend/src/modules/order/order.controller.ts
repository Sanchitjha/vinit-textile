import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { CreateOrderDtoType, OrderQueryDtoType } from './order.dto';
import { OrderService } from './order.service';

export class OrderController {
  constructor(private readonly orderService: OrderService = new OrderService()) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateOrderDtoType;
    const order = await this.orderService.createOrder(req.user!.id, dto);
    ApiResponse.success(res, 'Order placed successfully', order, 201);
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = req.query as unknown as OrderQueryDtoType;
    const result = await this.orderService.listForUser(req.user!.id, { page, limit });
    ApiResponse.success(res, 'Orders fetched successfully', result);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const order = await this.orderService.getForUser(req.user!.id, req.params.id);
    ApiResponse.success(res, 'Order fetched successfully', order);
  };

  cancel = async (req: Request, res: Response): Promise<void> => {
    const order = await this.orderService.cancelOrder(req.user!.id, req.params.id);
    ApiResponse.success(res, 'Order cancelled successfully', order);
  };
}
