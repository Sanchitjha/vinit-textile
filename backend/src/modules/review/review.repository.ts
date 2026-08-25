import { Types } from 'mongoose';
import { ReviewModel } from './review.model';
import { IReview, IReviewDocument } from './review.types';

export class ReviewRepository {
  create(data: Partial<IReview>): Promise<IReviewDocument> {
    return ReviewModel.create(data);
  }

  findByUserAndSaree(userId: string, sareeId: string): Promise<IReviewDocument | null> {
    return ReviewModel.findOne({ user: userId, saree: sareeId }).exec();
  }

  async findApprovedForSaree(
    sareeId: string,
    pagination: { skip: number; limit: number },
  ): Promise<{ items: IReviewDocument[]; total: number }> {
    const filter = { saree: sareeId, isApproved: true };
    const [items, total] = await Promise.all([
      ReviewModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('user', 'name avatar')
        .exec(),
      ReviewModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  async findAllForAdmin(
    filter: Record<string, unknown>,
    pagination: { skip: number; limit: number },
  ): Promise<{ items: IReviewDocument[]; total: number }> {
    const [items, total] = await Promise.all([
      ReviewModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('user', 'name email')
        .populate('saree', 'name slug')
        .exec(),
      ReviewModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<IReviewDocument | null> {
    return ReviewModel.findById(id).exec();
  }

  approve(id: string): Promise<IReviewDocument | null> {
    return ReviewModel.findByIdAndUpdate(id, { isApproved: true }, { new: true }).exec();
  }

  async getRatingStats(sareeId: string): Promise<{ average: number; count: number }> {
    const [result] = await ReviewModel.aggregate<{ _id: null; average: number; count: number }>([
      { $match: { saree: new Types.ObjectId(sareeId), isApproved: true } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]).exec();
    return { average: result?.average ?? 0, count: result?.count ?? 0 };
  }
}
