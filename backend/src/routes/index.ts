import { Router } from 'express';
import { adminRouter } from '../modules/admin/admin.routes';
import { authRouter } from '../modules/auth/auth.routes';
import { cartRouter } from '../modules/cart/cart.routes';
import { categoryRouter } from '../modules/category/category.routes';
import { couponRouter } from '../modules/coupon/coupon.routes';
import { adminOrderRouter } from '../modules/order/order.admin.routes';
import { orderRouter } from '../modules/order/order.routes';
import { paymentRouter } from '../modules/payment/payment.routes';
import { adminReviewRouter } from '../modules/review/review.admin.routes';
import { sareeRouter } from '../modules/saree/saree.routes';
import { userRouter } from '../modules/user/user.routes';
import { wishlistRouter } from '../modules/wishlist/wishlist.routes';
import { uploadRouter } from '../modules/upload/upload.routes';

export const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'Saree Ecommerce API', data: null });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/sarees', sareeRouter);
router.use('/cart', cartRouter);
router.use('/wishlist', wishlistRouter);
router.use('/orders', orderRouter);
router.use('/admin/orders', adminOrderRouter);
router.use('/payments', paymentRouter);
router.use('/coupons', couponRouter);
router.use('/admin/reviews', adminReviewRouter);
router.use('/admin', adminRouter);
router.use('/upload', uploadRouter);
