import { ClientSession } from 'mongoose';
import { CouponModel } from './coupon.model';
import { ICoupon, ICouponDocument } from './coupon.types';

export class CouponRepository {
  create(data: Partial<ICoupon>): Promise<ICouponDocument> {
    return CouponModel.create(data);
  }

  findById(id: string): Promise<ICouponDocument | null> {
    return CouponModel.findById(id).exec();
  }

  findByCode(code: string, session?: ClientSession): Promise<ICouponDocument | null> {
    return CouponModel.findOne({ code: code.toUpperCase() })
      .session(session ?? null)
      .exec();
  }

  find(filter: Record<string, unknown> = {}): Promise<ICouponDocument[]> {
    return CouponModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  updateById(id: string, data: Partial<ICoupon>): Promise<ICouponDocument | null> {
    return CouponModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  deleteById(id: string): Promise<ICouponDocument | null> {
    return CouponModel.findByIdAndDelete(id).exec();
  }

  /**
   * Atomically increments usedCount, guarded by usageLimit so concurrent
   * checkouts can never push usage past the configured limit.
   */
  incrementUsage(code: string, session: ClientSession): Promise<ICouponDocument | null> {
    return CouponModel.findOneAndUpdate(
      {
        code: code.toUpperCase(),
        isActive: true,
        $or: [{ usageLimit: null }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }],
      },
      { $inc: { usedCount: 1 } },
      { new: true, session },
    ).exec();
  }

  decrementUsage(code: string, session?: ClientSession): Promise<ICouponDocument | null> {
    return CouponModel.findOneAndUpdate(
      { code: code.toUpperCase(), usedCount: { $gt: 0 } },
      { $inc: { usedCount: -1 } },
      { new: true, session: session ?? null },
    ).exec();
  }
}
