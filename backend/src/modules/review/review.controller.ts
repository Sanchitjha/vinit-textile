import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { CreateReviewDtoType, ReviewQueryDtoType } from './review.dto';
import { ReviewService } from './review.service';

export class ReviewController {
  constructor(private readonly reviewService: ReviewService = new ReviewService()) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = req.query as unknown as ReviewQueryDtoType;
    const result = await this.reviewService.listForSaree(req.params.sareeId, { page, limit });
    ApiResponse.success(res, 'Reviews fetched successfully', result);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateReviewDtoType;
    const review = await this.reviewService.createReview(req.user!.id, req.params.sareeId, dto);
    ApiResponse.success(res, 'Review submitted successfully, pending moderation', review, 201);
  };
}
