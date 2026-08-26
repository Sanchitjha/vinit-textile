import { ClientSession } from 'mongoose';
import { BadRequestError, ConflictError, NotFoundError } from '../../shared/errors';
import { CouponRepository } from './coupon.repository';
import { CreateCouponDtoType, UpdateCouponDtoType } from './coupon.dto';
import { CouponValidationResult, ICouponDocument } from './coupon.types';

export class CouponService {
  constructor(private readonly couponRepository: CouponRepository = new CouponRepository()) {}

  async list(): Promise<ICouponDocument[]> {
    return this.couponRepository.find();
  }

  async getById(id: string): Promise<ICouponDocument> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) throw new NotFoundError('Coupon not found', 'COUPON_NOT_FOUND');
    return coupon;
  }

  async create(dto: CreateCouponDtoType): Promise<ICouponDocument> {
    const existing = await this.couponRepository.findByCode(dto.code);
    if (existing) throw new ConflictError('Coupon code already exists', 'COUPON_EXISTS');
    return this.couponRepository.create({
      ...dto,
      code: dto.code.toUpperCase(),
      maximumDiscount: dto.maximumDiscount ?? null,
      usageLimit: dto.usageLimit ?? null,
    });
  }

  async update(id: string, dto: UpdateCouponDtoType): Promise<ICouponDocument> {
    const patch = dto.code ? { ...dto, code: dto.code.toUpperCase() } : dto;
    const updated = await this.couponRepository.updateById(id, patch);
    if (!updated) throw new NotFoundError('Coupon not found', 'COUPON_NOT_FOUND');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.couponRepository.deleteById(id);
    if (!deleted) throw new NotFoundError('Coupon not found', 'COUPON_NOT_FOUND');
  }

  /**
   * Read-only validation: checks eligibility and computes the discount for a
   * given order value, without mutating usedCount.
   */
  async validate(code: string, orderValue: number, session?: ClientSession): Promise<CouponValidationResult> {
    const coupon = await this.couponRepository.findByCode(code, session);
    if (!coupon || !coupon.isActive) {
      throw new NotFoundError('Coupon not found or inactive', 'COUPON_NOT_FOUND');
    }
    if (coupon.expiresAt.getTime() < Date.now()) {
      throw new BadRequestError('Coupon has expired', 'COUPON_EXPIRED');
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestError('Coupon usage limit reached', 'COUPON_LIMIT_REACHED');
    }
    if (orderValue < coupon.minimumOrderValue) {
      throw new BadRequestError(
        `Order value must be at least ${coupon.minimumOrderValue} to use this coupon`,
        'COUPON_MIN_ORDER_NOT_MET',
      );
    }

    const discount = this.computeDiscount(coupon, orderValue);
    return { coupon, discount };
  }

  /**
   * Atomically consumes one use of the coupon inside an order transaction.
   * Returns null if the usage-limit guard rejected the increment (a
   * concurrent checkout used the last slot), signalling the caller to abort.
   */
  async applyUsage(code: string, session: ClientSession): Promise<ICouponDocument | null> {
    return this.couponRepository.incrementUsage(code, session);
  }

  releaseUsage(code: string, session?: ClientSession): Promise<ICouponDocument | null> {
    return this.couponRepository.decrementUsage(code, session);
  }

  private computeDiscount(coupon: ICouponDocument, orderValue: number): number {
    let discount =
      coupon.discountType === 'percentage' ? (orderValue * coupon.discountValue) / 100 : coupon.discountValue;

    if (coupon.maximumDiscount !== null) {
      discount = Math.min(discount, coupon.maximumDiscount);
    }
    return Math.min(discount, orderValue);
  }
}
