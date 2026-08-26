import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { OrderQueryDtoType, UpdateOrderStatusDtoType } from './order.dto';
import { OrderService } from './order.service';

export class AdminOrderController {
  constructor(private readonly orderService: OrderService = new OrderService()) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, orderStatus } = req.query as unknown as OrderQueryDtoType;
    const result = await this.orderService.listAll({ orderStatus }, { page, limit });
    ApiResponse.success(res, 'Orders fetched successfully', result);
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateOrderStatusDtoType;
    const order = await this.orderService.updateStatus(req.params.id, dto.orderStatus);
    ApiResponse.success(res, 'Order status updated successfully', order);
  };
}
