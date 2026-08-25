import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../shared/errors';
import { PaginatedResult, buildPaginationMeta } from '../../shared/responses/Paginated';
import { toSkipLimit } from '../../shared/utils/pagination.util';
import { OrderRepository } from '../order/order.repository';
import { SareeRepository } from '../saree/saree.repository';
import { CreateReviewDtoType } from './review.dto';
import { ReviewRepository } from './review.repository';
import { IReviewDocument } from './review.types';

export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository = new ReviewRepository(),
    private readonly orderRepository: OrderRepository = new OrderRepository(),
    private readonly sareeRepository: SareeRepository = new SareeRepository(),
  ) {}

  async listForSaree(
    sareeId: string,
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<IReviewDocument>> {
    const { skip, limit } = toSkipLimit(pagination);
    const { items, total } = await this.reviewRepository.findApprovedForSaree(sareeId, { skip, limit });
    return { items, meta: buildPaginationMeta(pagination.page, limit, total) };
  }

  async createReview(userId: string, sareeId: string, dto: CreateReviewDtoType): Promise<IReviewDocument> {
    const saree = await this.sareeRepository.findById(sareeId);
    if (!saree) throw new NotFoundError('Saree not found', 'SAREE_NOT_FOUND');

    const order = await this.orderRepository.findByIdForUser(dto.orderId, userId);
    if (!order) throw new NotFoundError('Order not found', 'ORDER_NOT_FOUND');
    if (order.orderStatus !== 'DELIVERED') {
      throw new ForbiddenError('You can only review sarees from delivered orders', 'ORDER_NOT_DELIVERED');
    }
    const purchasedThisSaree = order.items.some((item) => item.saree.toString() === sareeId);
    if (!purchasedThisSaree) {
      throw new BadRequestError('This order does not include the saree being reviewed', 'SAREE_NOT_IN_ORDER');
    }

    const existing = await this.reviewRepository.findByUserAndSaree(userId, sareeId);
    if (existing) throw new ConflictError('You have already reviewed this saree', 'REVIEW_ALREADY_EXISTS');

    const review = await this.reviewRepository.create({
      user: userId as unknown as IReviewDocument['user'],
      saree: sareeId as unknown as IReviewDocument['saree'],
      order: dto.orderId as unknown as IReviewDocument['order'],
      rating: dto.rating,
      comment: dto.comment,
      images: dto.images,
    });

    return review;
  }

  async listForAdmin(
    filter: { isApproved?: boolean },
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<IReviewDocument>> {
    const { skip, limit } = toSkipLimit(pagination);
    const query: Record<string, unknown> = {};
    if (filter.isApproved !== undefined) query.isApproved = filter.isApproved;
    const { items, total } = await this.reviewRepository.findAllForAdmin(query, { skip, limit });
    return { items, meta: buildPaginationMeta(pagination.page, limit, total) };
  }

  async approve(reviewId: string): Promise<IReviewDocument> {
    const review = await this.reviewRepository.approve(reviewId);
    if (!review) throw new NotFoundError('Review not found', 'REVIEW_NOT_FOUND');

    const stats = await this.reviewRepository.getRatingStats(review.saree.toString());
    await this.sareeRepository.updateRatingStats(review.saree.toString(), Math.round(stats.average * 10) / 10, stats.count);

    return review;
  }
}
