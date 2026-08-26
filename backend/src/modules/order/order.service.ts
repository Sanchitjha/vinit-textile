import mongoose, { Types } from 'mongoose';
import { env } from '../../config/env';
import { BadRequestError, ConflictError, NotFoundError } from '../../shared/errors';
import { CANCELLABLE_ORDER_STATUSES, OrderStatus } from '../../shared/constants/orderStatus.constant';
import { PaymentMethod, PaymentStatus } from '../../shared/constants/paymentStatus.constant';
import { PaginatedResult, buildPaginationMeta } from '../../shared/responses/Paginated';
import { toSkipLimit } from '../../shared/utils/pagination.util';
import { CartRepository } from '../cart/cart.repository';
import { CouponService } from '../coupon/coupon.service';
import { PaymentService } from '../payment/payment.service';
import { SareeRepository } from '../saree/saree.repository';
import { UserRepository } from '../user/user.repository';
import { CreateOrderDtoType } from './order.dto';
import { generateOrderNumber } from './order-number.util';
import { OrderRepository } from './order.repository';
import { IOrderDocument, IOrderItem } from './order.types';
import { logger } from '../../shared/utils/logger.util';

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository = new OrderRepository(),
    private readonly sareeRepository: SareeRepository = new SareeRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly cartRepository: CartRepository = new CartRepository(),
    private readonly couponService: CouponService = new CouponService(),
    private readonly paymentService: PaymentService = new PaymentService(),
  ) {}

  async createOrder(userId: string, dto: CreateOrderDtoType): Promise<IOrderDocument> {
    const session = await mongoose.startSession();
    let createdOrder: IOrderDocument | null = null;

    try {
      await session.withTransaction(async () => {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');

        const address = user.addresses.find((a) => a._id?.toString() === dto.addressId);
        if (!address) throw new NotFoundError('Shipping address not found', 'ADDRESS_NOT_FOUND');

        const mergedItems = this.mergeDuplicateItems(dto.items);
        const items: IOrderItem[] = [];
        let subtotal = 0;

        for (const requested of mergedItems) {
          const saree = await this.sareeRepository.deductStock(requested.sareeId, requested.quantity, session);
          if (!saree) {
            const existing = await this.sareeRepository.findById(requested.sareeId);
            const label = existing?.name ?? requested.sareeId;
            throw new ConflictError(`Insufficient stock for "${label}"`, 'INSUFFICIENT_STOCK');
          }

          items.push({
            saree: saree._id as Types.ObjectId,
            name: saree.name,
            image: saree.images[0] ?? null,
            price: saree.price,
            quantity: requested.quantity,
          });
          subtotal += saree.price * requested.quantity;
        }

        let discount = 0;
        let couponCode: string | null = null;
        if (dto.couponCode) {
          const validation = await this.couponService.validate(dto.couponCode, subtotal, session);
          const applied = await this.couponService.applyUsage(dto.couponCode, session);
          if (!applied) {
            throw new ConflictError('Coupon usage limit reached', 'COUPON_LIMIT_REACHED');
          }
          discount = validation.discount;
          couponCode = validation.coupon.code;
        }

        const taxableAmount = subtotal - discount;
        const shippingFee =
          taxableAmount >= env.business.freeShippingThreshold ? 0 : env.business.standardShippingFee;
        const total = taxableAmount + shippingFee;

        const order = await this.orderRepository.create(
          {
            orderNumber: generateOrderNumber(),
            user: new Types.ObjectId(userId),
            items,
            shippingAddress: {
              name: address.name,
              phone: address.phone,
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
              isDefault: address.isDefault,
            },
            subtotal,
            discount,
            couponCode,
            shippingFee,
            total,
            paymentMethod: dto.paymentMethod,
            paymentStatus: PaymentStatus.PENDING,
            orderStatus: OrderStatus.PENDING,
          },
          session,
        );

        await this.cartRepository.clear(userId, session);
        createdOrder = order;
      });
    } finally {
      await session.endSession();
    }

    if (!createdOrder) {
      throw new ConflictError('Order could not be created', 'ORDER_CREATION_FAILED');
    }
    const finalOrder = createdOrder as IOrderDocument;

    if (finalOrder.paymentMethod === PaymentMethod.RAZORPAY) {
      // Best-effort: the order already exists in PENDING state regardless of
      // outcome here. The client can retry via POST /payments/:orderId/initiate.
      try {
        await this.paymentService.initiate(userId, finalOrder.id);
      } catch (err) {
        logger.error('Failed to auto-initiate payment for order', err);
      }
    }

    return finalOrder;
  }

  async listForUser(userId: string, pagination: { page: number; limit: number }): Promise<PaginatedResult<IOrderDocument>> {
    const { skip, limit } = toSkipLimit(pagination);
    const { items, total } = await this.orderRepository.findByUser(userId, { skip, limit });
    return { items, meta: buildPaginationMeta(pagination.page, limit, total) };
  }

  async getForUser(userId: string, orderId: string): Promise<IOrderDocument> {
    const order = await this.orderRepository.findByIdForUser(orderId, userId);
    if (!order) throw new NotFoundError('Order not found', 'ORDER_NOT_FOUND');
    return order;
  }

  async cancelOrder(userId: string, orderId: string): Promise<IOrderDocument> {
    const session = await mongoose.startSession();
    let cancelled: IOrderDocument | null = null;

    try {
      await session.withTransaction(async () => {
        const order = await this.orderRepository.findByIdForUser(orderId, userId, session);
        if (!order) throw new NotFoundError('Order not found', 'ORDER_NOT_FOUND');

        if (!CANCELLABLE_ORDER_STATUSES.includes(order.orderStatus)) {
          throw new BadRequestError(
            `Order in status ${order.orderStatus} cannot be cancelled`,
            'ORDER_NOT_CANCELLABLE',
          );
        }

        for (const item of order.items) {
          await this.sareeRepository.restoreStock(item.saree.toString(), item.quantity, session);
        }

        if (order.couponCode) {
          await this.couponService.releaseUsage(order.couponCode, session);
        }

        const updated = await this.orderRepository.updateStatus(orderId, OrderStatus.CANCELLED, session);
        cancelled = updated;
      });
    } finally {
      await session.endSession();
    }

    if (!cancelled) throw new NotFoundError('Order not found', 'ORDER_NOT_FOUND');
    return cancelled;
  }

  async listAll(
    filter: { orderStatus?: OrderStatus },
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<IOrderDocument>> {
    const { skip, limit } = toSkipLimit(pagination);
    const query: Record<string, unknown> = {};
    if (filter.orderStatus) query.orderStatus = filter.orderStatus;
    const { items, total } = await this.orderRepository.findAll(query, { skip, limit });
    return { items, meta: buildPaginationMeta(pagination.page, limit, total) };
  }

  async updateStatus(orderId: string, orderStatus: OrderStatus): Promise<IOrderDocument> {
    const updated = await this.orderRepository.updateStatus(orderId, orderStatus);
    if (!updated) throw new NotFoundError('Order not found', 'ORDER_NOT_FOUND');
    return updated;
  }

  private mergeDuplicateItems(items: CreateOrderDtoType['items']): CreateOrderDtoType['items'] {
    const map = new Map<string, number>();
    for (const item of items) {
      map.set(item.sareeId, (map.get(item.sareeId) ?? 0) + item.quantity);
    }
    return Array.from(map.entries()).map(([sareeId, quantity]) => ({ sareeId, quantity }));
  }
}
