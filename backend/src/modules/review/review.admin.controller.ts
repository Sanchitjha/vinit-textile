import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { ReviewQueryDtoType } from './review.dto';
import { ReviewService } from './review.service';

export class AdminReviewController {
  constructor(private readonly reviewService: ReviewService = new ReviewService()) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = req.query as unknown as ReviewQueryDtoType;
    const isApproved = req.query.isApproved as string | undefined;
    const result = await this.reviewService.listForAdmin(
      { isApproved: isApproved === undefined ? undefined : isApproved === 'true' },
      { page, limit },
    );
    ApiResponse.success(res, 'Reviews fetched successfully', result);
  };

  approve = async (req: Request, res: Response): Promise<void> => {
    const review = await this.reviewService.approve(req.params.id);
    ApiResponse.success(res, 'Review approved successfully', review);
  };
}
