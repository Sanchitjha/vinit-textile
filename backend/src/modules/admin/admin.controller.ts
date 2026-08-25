import { Request, Response } from 'express';
import { env } from '../../config/env';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { SareeService } from '../saree/saree.service';
import { AdminService } from './admin.service';
import { AdminUserQueryDtoType, UpdateUserStatusDtoType } from './admin.dto';

export class AdminController {
  constructor(
    private readonly adminService: AdminService = new AdminService(),
    private readonly sareeService: SareeService = new SareeService(),
  ) {}

  dashboard = async (_req: Request, res: Response): Promise<void> => {
    const stats = await this.adminService.getDashboardStats();
    ApiResponse.success(res, 'Dashboard stats fetched successfully', stats);
  };

  lowStock = async (_req: Request, res: Response): Promise<void> => {
    const sarees = await this.sareeService.listLowStock(env.business.lowStockThreshold);
    ApiResponse.success(res, 'Low stock sarees fetched successfully', sarees);
  };

  listUsers = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, isActive } = req.query as unknown as AdminUserQueryDtoType;
    const result = await this.adminService.listUsers({ isActive }, { page, limit });
    ApiResponse.success(res, 'Users fetched successfully', result);
  };

  updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateUserStatusDtoType;
    const user = await this.adminService.setUserStatus(req.params.id, dto.isActive);
    ApiResponse.success(res, 'User status updated successfully', user);
  };
}
