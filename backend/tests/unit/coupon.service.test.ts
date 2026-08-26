import { CouponService } from '../../src/modules/coupon/coupon.service';
import { CouponRepository } from '../../src/modules/coupon/coupon.repository';
import { ICouponDocument } from '../../src/modules/coupon/coupon.types';

function buildCoupon(overrides: Partial<ICouponDocument> = {}): ICouponDocument {
  return {
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrderValue: 500,
    maximumDiscount: 300,
    usageLimit: 100,
    usedCount: 0,
    expiresAt: new Date(Date.now() + 86400000),
    isActive: true,
    ...overrides,
  } as ICouponDocument;
}

describe('CouponService.validate', () => {
  it('computes a percentage discount capped by maximumDiscount', async () => {
    const repository = {
      findByCode: jest.fn().mockResolvedValue(buildCoupon()),
    } as unknown as CouponRepository;
    const service = new CouponService(repository);

    const result = await service.validate('SAVE20', 2000);

    // 20% of 2000 = 400, capped at maximumDiscount 300
    expect(result.discount).toBe(300);
  });

  it('rejects orders below the minimum order value', async () => {
    const repository = {
      findByCode: jest.fn().mockResolvedValue(buildCoupon({ minimumOrderValue: 1000 })),
    } as unknown as CouponRepository;
    const service = new CouponService(repository);

    await expect(service.validate('SAVE20', 500)).rejects.toMatchObject({
      code: 'COUPON_MIN_ORDER_NOT_MET',
    });
  });

  it('rejects expired coupons', async () => {
    const repository = {
      findByCode: jest.fn().mockResolvedValue(buildCoupon({ expiresAt: new Date(Date.now() - 1000) })),
    } as unknown as CouponRepository;
    const service = new CouponService(repository);

    await expect(service.validate('SAVE20', 2000)).rejects.toMatchObject({ code: 'COUPON_EXPIRED' });
  });

  it('rejects coupons that reached their usage limit', async () => {
    const repository = {
      findByCode: jest.fn().mockResolvedValue(buildCoupon({ usageLimit: 5, usedCount: 5 })),
    } as unknown as CouponRepository;
    const service = new CouponService(repository);

    await expect(service.validate('SAVE20', 2000)).rejects.toMatchObject({
      code: 'COUPON_LIMIT_REACHED',
    });
  });

  it('rejects unknown coupon codes', async () => {
    const repository = {
      findByCode: jest.fn().mockResolvedValue(null),
    } as unknown as CouponRepository;
    const service = new CouponService(repository);

    await expect(service.validate('MISSING', 2000)).rejects.toMatchObject({
      code: 'COUPON_NOT_FOUND',
    });
  });
});
