import { env } from '../../config/env';
import { NotFoundError } from '../../shared/errors';
import { PaginatedResult, buildPaginationMeta } from '../../shared/responses/Paginated';
import { toSkipLimit } from '../../shared/utils/pagination.util';
import { OrderRepository } from '../order/order.repository';
import { SareeRepository } from '../saree/saree.repository';
import { UserRepository } from '../user/user.repository';
import { IUserDocument } from '../user/user.types';
import { DashboardStats } from './admin.types';

export class AdminService {
  constructor(
    private readonly orderRepository: OrderRepository = new OrderRepository(),
    private readonly sareeRepository: SareeRepository = new SareeRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [{ totalOrders, totalRevenue }, lowStock] = await Promise.all([
      this.orderRepository.getDashboardStats(),
      this.sareeRepository.findLowStock(env.business.lowStockThreshold),
    ]);
    return { totalOrders, totalRevenue, lowStockCount: lowStock.length };
  }

  async listUsers(
    filter: { isActive?: boolean },
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<IUserDocument>> {
    const { skip, limit } = toSkipLimit(pagination);
    const query: Record<string, unknown> = {};
    if (filter.isActive !== undefined) query.isActive = filter.isActive;
    const { items, total } = await this.userRepository.findAllPaginated(query, { skip, limit });
    return { items, meta: buildPaginationMeta(pagination.page, limit, total) };
  }

  async setUserStatus(userId: string, isActive: boolean): Promise<IUserDocument> {
    const updated = await this.userRepository.setActiveStatus(userId, isActive);
    if (!updated) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    return updated;
  }
}
