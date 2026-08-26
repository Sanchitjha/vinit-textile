import { Types } from 'mongoose';
import { CategoryModel } from '../../src/modules/category/category.model';
import { OrderModel } from '../../src/modules/order/order.model';
import { ReviewService } from '../../src/modules/review/review.service';
import { SareeModel } from '../../src/modules/saree/saree.model';
import { UserModel } from '../../src/modules/user/user.model';
import { OrderStatus } from '../../src/shared/constants/orderStatus.constant';
import { PaymentMethod, PaymentStatus } from '../../src/shared/constants/paymentStatus.constant';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../testDb';

async function seedSaree() {
  const category = await CategoryModel.create({ name: 'Cotton Sarees', slug: 'cotton-sarees' });
  return SareeModel.create({
    name: 'Handloom Cotton Saree',
    slug: `handloom-cotton-saree-${Date.now()}`,
    description: 'Soft handloom cotton saree',
    category: category._id,
    images: ['https://example.com/image.jpg'],
    price: 1499,
    sku: `SKU-${Date.now()}`,
    stock: 5,
    fabric: 'Cotton',
    color: 'Green',
  });
}

async function seedUser() {
  return UserModel.create({
    name: 'Reviewer',
    email: 'reviewer@example.com',
    phone: '9222222222',
    password: 'password123',
  });
}

describe('Review purchase verification', () => {
  beforeAll(async () => {
    await connectTestDb();
  }, 60000);

  afterEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  const reviewService = new ReviewService();

  it('rejects a review when the user has not purchased the saree', async () => {
    const user = await seedUser();
    const saree = await seedSaree();

    await expect(
      reviewService.createReview(user.id, saree.id, {
        orderId: new Types.ObjectId().toString(),
        rating: 5,
        comment: 'Great!',
        images: [],
      }),
    ).rejects.toMatchObject({ code: 'ORDER_NOT_FOUND' });
  });

  it('rejects a review when the order has not been delivered yet', async () => {
    const user = await seedUser();
    const saree = await seedSaree();
    const order = await OrderModel.create({
      orderNumber: `ORD-TEST-${Date.now()}`,
      user: user._id,
      items: [{ saree: saree._id, name: saree.name, image: null, price: saree.price, quantity: 1 }],
      shippingAddress: {
        name: 'Reviewer',
        phone: '9222222222',
        addressLine1: '1 Test St',
        city: 'Pune',
        state: 'MH',
        postalCode: '411001',
        country: 'India',
        isDefault: true,
      },
      subtotal: saree.price,
      total: saree.price,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
    });

    await expect(
      reviewService.createReview(user.id, saree.id, {
        orderId: order.id,
        rating: 4,
        comment: 'Nice',
        images: [],
      }),
    ).rejects.toMatchObject({ code: 'ORDER_NOT_DELIVERED' });
  });

  it('allows a review once the order is delivered, and blocks a second review for the same saree', async () => {
    const user = await seedUser();
    const saree = await seedSaree();
    const order = await OrderModel.create({
      orderNumber: `ORD-TEST-${Date.now()}`,
      user: user._id,
      items: [{ saree: saree._id, name: saree.name, image: null, price: saree.price, quantity: 1 }],
      shippingAddress: {
        name: 'Reviewer',
        phone: '9222222222',
        addressLine1: '1 Test St',
        city: 'Pune',
        state: 'MH',
        postalCode: '411001',
        country: 'India',
        isDefault: true,
      },
      subtotal: saree.price,
      total: saree.price,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.DELIVERED,
    });

    const review = await reviewService.createReview(user.id, saree.id, {
      orderId: order.id,
      rating: 5,
      comment: 'Loved it',
      images: [],
    });
    expect(review.isApproved).toBe(false);

    await expect(
      reviewService.createReview(user.id, saree.id, {
        orderId: order.id,
        rating: 3,
        comment: 'Second attempt',
        images: [],
      }),
    ).rejects.toMatchObject({ code: 'REVIEW_ALREADY_EXISTS' });
  });
});
