import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { CouponService } from './coupon.service';
import { CreateCouponDtoType, UpdateCouponDtoType, ValidateCouponDtoType } from './coupon.dto';

export class CouponController {
  constructor(private readonly couponService: CouponService = new CouponService()) {}

  validate = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as ValidateCouponDtoType;
    const result = await this.couponService.validate(dto.code, dto.orderValue);
    ApiResponse.success(res, 'Coupon is valid', {
      code: result.coupon.code,
      discountType: result.coupon.discountType,
      discount: result.discount,
    });
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const coupons = await this.couponService.list();
    ApiResponse.success(res, 'Coupons fetched successfully', coupons);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateCouponDtoType;
    const coupon = await this.couponService.create(dto);
    ApiResponse.success(res, 'Coupon created successfully', coupon, 201);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateCouponDtoType;
    const coupon = await this.couponService.update(req.params.id, dto);
    ApiResponse.success(res, 'Coupon updated successfully', coupon);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.couponService.delete(req.params.id);
    ApiResponse.success(res, 'Coupon deleted successfully');
  };
}
