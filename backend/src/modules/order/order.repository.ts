import { ClientSession, FilterQuery } from 'mongoose';
import { OrderModel } from './order.model';
import { IOrder, IOrderDocument } from './order.types';

export class OrderRepository {
  async create(data: Partial<IOrder>, session: ClientSession): Promise<IOrderDocument> {
    const [order] = await OrderModel.create([data], { session });
    return order;
  }

  findById(id: string): Promise<IOrderDocument | null> {
    return OrderModel.findById(id).exec();
  }

  findByIdForUser(id: string, userId: string, session?: ClientSession): Promise<IOrderDocument | null> {
    return OrderModel.findOne({ _id: id, user: userId })
      .session(session ?? null)
      .exec();
  }

  findByOrderNumber(orderNumber: string): Promise<IOrderDocument | null> {
    return OrderModel.findOne({ orderNumber }).exec();
  }

  async findByUser(
    userId: string,
    pagination: { skip: number; limit: number },
  ): Promise<{ items: IOrderDocument[]; total: number }> {
    const filter = { user: userId };
    const [items, total] = await Promise.all([
      OrderModel.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).exec(),
      OrderModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  async findAll(
    filter: FilterQuery<IOrderDocument>,
    pagination: { skip: number; limit: number },
  ): Promise<{ items: IOrderDocument[]; total: number }> {
    const [items, total] = await Promise.all([
      OrderModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('user', 'name email phone')
        .exec(),
      OrderModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  updateStatus(id: string, orderStatus: IOrder['orderStatus'], session?: ClientSession): Promise<IOrderDocument | null> {
    return OrderModel.findByIdAndUpdate(id, { orderStatus }, { new: true, session: session ?? null }).exec();
  }

  updatePaymentStatus(
    id: string,
    paymentStatus: IOrder['paymentStatus'],
    session?: ClientSession,
  ): Promise<IOrderDocument | null> {
    return OrderModel.findByIdAndUpdate(id, { paymentStatus }, { new: true, session: session ?? null }).exec();
  }

  countDeliveredOrderForUserWithSaree(userId: string, sareeId: string): Promise<IOrderDocument | null> {
    return OrderModel.findOne({
      user: userId,
      orderStatus: 'DELIVERED',
      'items.saree': sareeId,
    }).exec();
  }

  async getDashboardStats(): Promise<{ totalOrders: number; totalRevenue: number }> {
    const [totalOrders, revenueAgg] = await Promise.all([
      OrderModel.countDocuments().exec(),
      OrderModel.aggregate<{ _id: null; total: number }>([
        { $match: { paymentStatus: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]).exec(),
    ]);
    return { totalOrders, totalRevenue: revenueAgg[0]?.total ?? 0 };
  }
}
