import { CategoryModel } from '../../src/modules/category/category.model';
import { OrderService } from '../../src/modules/order/order.service';
import { SareeModel } from '../../src/modules/saree/saree.model';
import { UserModel } from '../../src/modules/user/user.model';
import { PaymentMethod } from '../../src/shared/constants/paymentStatus.constant';
import { clearTestDb, connectTestDb, disconnectTestDb } from '../testDb';

async function seedUserWithAddress() {
  const user = await UserModel.create({
    name: 'Test Customer',
    email: 'customer@example.com',
    phone: '9000000000',
    password: 'password123',
    addresses: [
      {
        name: 'Test Customer',
        phone: '9000000000',
        addressLine1: '123 Main St',
        city: 'Mumbai',
        state: 'MH',
        postalCode: '400001',
        country: 'India',
        isDefault: true,
      },
    ],
  });
  return { user, addressId: user.addresses[0]._id!.toString() };
}

async function seedSaree(stock: number, price = 3999) {
  const category = await CategoryModel.create({ name: 'Silk Sarees', slug: 'silk-sarees' });
  return SareeModel.create({
    name: 'Banarasi Silk Saree',
    slug: `banarasi-silk-saree-${Date.now()}-${Math.random()}`,
    description: 'A beautiful handwoven saree',
    category: category._id,
    images: ['https://example.com/image.jpg'],
    price,
    sku: `SKU-${Date.now()}-${Math.random()}`,
    stock,
    fabric: 'Silk',
    color: 'Royal Blue',
  });
}

describe('Order creation — atomic stock deduction', () => {
  beforeAll(async () => {
    await connectTestDb();
  }, 60000);

  afterEach(async () => {
    await clearTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  const orderService = new OrderService();

  it('deducts stock and computes total from live saree price, not any client-supplied value', async () => {
    const { user, addressId } = await seedUserWithAddress();
    const saree = await seedSaree(10, 3999);

    const order = await orderService.createOrder(user.id, {
      items: [{ sareeId: saree.id, quantity: 2 }],
      addressId,
      paymentMethod: PaymentMethod.COD,
    });

    expect(order.subtotal).toBe(3999 * 2);
    expect(order.total).toBeGreaterThan(0);

    const updatedSaree = await SareeModel.findById(saree.id);
    expect(updatedSaree!.stock).toBe(8);
  });

  it('rejects an order that exceeds available stock and leaves stock untouched', async () => {
    const { user, addressId } = await seedUserWithAddress();
    const saree = await seedSaree(1, 3999);

    await expect(
      orderService.createOrder(user.id, {
        items: [{ sareeId: saree.id, quantity: 5 }],
        addressId,
        paymentMethod: PaymentMethod.COD,
      }),
    ).rejects.toMatchObject({ code: 'INSUFFICIENT_STOCK' });

    const unchangedSaree = await SareeModel.findById(saree.id);
    expect(unchangedSaree!.stock).toBe(1);
  });

  it('only allows one of two concurrent orders to succeed when stock is 1', async () => {
    const { user: userA, addressId: addressIdA } = await seedUserWithAddress();
    const userB = await UserModel.create({
      name: 'Second Customer',
      email: 'second@example.com',
      phone: '9111111111',
      password: 'password123',
      addresses: [
        {
          name: 'Second Customer',
          phone: '9111111111',
          addressLine1: '456 Side St',
          city: 'Delhi',
          state: 'DL',
          postalCode: '110001',
          country: 'India',
          isDefault: true,
        },
      ],
    });
    const saree = await seedSaree(1, 1999);

    const results = await Promise.allSettled([
      orderService.createOrder(userA.id, {
        items: [{ sareeId: saree.id, quantity: 1 }],
        addressId: addressIdA,
        paymentMethod: PaymentMethod.COD,
      }),
      orderService.createOrder(userB.id, {
        items: [{ sareeId: saree.id, quantity: 1 }],
        addressId: userB.addresses[0]._id!.toString(),
        paymentMethod: PaymentMethod.COD,
      }),
    ]);

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');
    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);

    const finalSaree = await SareeModel.findById(saree.id);
    expect(finalSaree!.stock).toBe(0);
  });
});
