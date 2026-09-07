import { Role } from '../constants/roles.constant';
import { logger } from './logger.util';
import { UserModel } from '../../modules/user/user.model';
import { CategoryModel } from '../../modules/category/category.model';
import { SareeModel } from '../../modules/saree/saree.model';
import { CouponModel } from '../../modules/coupon/coupon.model';

export async function seedInitialData(): Promise<void> {
  try {
    // 1. Seed Admin User
    const existingAdmin = await UserModel.findOne({ role: Role.ADMIN });
    if (!existingAdmin) {
      const admin = new UserModel({
        name: 'Vinit Pandey',
        email: 'admin@vinittextiles.com',
        password: 'admin123',
        role: Role.ADMIN,
        isActive: true,
      });
      await admin.save();
      logger.info('Seeded default admin: admin@vinittextiles.com / admin123');
    }

    // 2. Seed Categories
    const categoryCount = await CategoryModel.countDocuments();
    let sareeCategory = await CategoryModel.findOne({ slug: 'saree' });

    if (categoryCount === 0 || !sareeCategory) {
      const cats = [
        { name: 'Saree', slug: 'saree', description: 'Timeless handloom and designer sarees' },
        { name: 'Silk Saree', slug: 'silk-saree', description: 'Pure Banarasi, Kanjivaram & Tussar silks' },
        { name: 'Bridal Saree', slug: 'bridal-saree', description: 'Heavily embellished bridal trousseaus' },
        { name: 'Partywear Saree', slug: 'partywear', description: 'Contemporary organza and tissue drapes' },
        { name: 'Kurti', slug: 'kurti', description: 'Handcrafted kurtis and ethnic sets' },
        { name: 'Lehenga', slug: 'lehenga', description: 'Festive and bridal lehenga cholis' },
      ];

      for (const cat of cats) {
        await CategoryModel.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
      }
      sareeCategory = await CategoryModel.findOne({ slug: 'saree' });
      logger.info('Seeded default ethnic wear categories');
    }

    // 3. Seed Sarees
    const sareeCount = await SareeModel.countDocuments();
    if (sareeCount === 0 && sareeCategory) {
      const initialSarees = [
        {
          name: 'Teal Banarasi Silk Saree with Gold Zari Weave',
          slug: 'teal-banarasi-silk-saree-gold-zari',
          description: 'Luxurious Banarasi silk saree hand-woven in rich teal with authentic floral gold zari motifs and intricate border.',
          category: sareeCategory._id,
          images: ['/images/banner-new-arrivals.webp', '/images/banner-sarees-collection.webp'],
          price: 6800,
          compareAtPrice: 8500,
          discount: 20,
          sku: 'VT-BAN-001',
          stock: 12,
          fabric: 'Banarasi Silk',
          color: 'Teal',
          colors: ['Teal', 'Gold'],
          sareeType: 'Banarasi',
          weave: 'Jacquard Zari',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.9,
          reviewCount: 48,
        },
        {
          name: 'Maroon Organza Saree with Gota Swirl Embroidery',
          slug: 'maroon-organza-saree-gota-swirl',
          description: 'Ethereal sheer maroon organza saree adorned with delicate handcrafted gota patti swirls along the scalloped pallu.',
          category: sareeCategory._id,
          images: ['/images/banner-timeless-elegance.webp'],
          price: 4200,
          compareAtPrice: 5800,
          discount: 28,
          sku: 'VT-ORG-002',
          stock: 8,
          fabric: 'Organza',
          color: 'Maroon',
          colors: ['Maroon', 'Gold'],
          sareeType: 'Organza',
          weave: 'Hand Embroidery',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.8,
          reviewCount: 36,
        },
        {
          name: 'Linen Georgette Saree with Sequin Border',
          slug: 'linen-georgette-saree-sequin-border',
          description: 'Airy linen georgette in festive emerald green complemented by a fine micro-sequin border.',
          category: sareeCategory._id,
          images: ['/images/banner-sarees-collection.webp'],
          price: 2895,
          compareAtPrice: 3600,
          discount: 20,
          sku: 'VT-LIN-003',
          stock: 4, // Low stock indicator
          fabric: 'Georgette',
          color: 'Emerald Green',
          colors: ['Green'],
          sareeType: 'Daily Wear',
          weave: 'Plain Weave with Border',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.7,
          reviewCount: 19,
        },
        {
          name: 'Handloom Cotton Saree with Ikat Print',
          slug: 'handloom-cotton-saree-ikat-print',
          description: 'Breathable pure handloom cotton woven by master artisans with traditional Pochampally-inspired geometric Ikat.',
          category: sareeCategory._id,
          images: ['/images/banner-new-arrivals.webp'],
          price: 2299,
          compareAtPrice: 2800,
          discount: 18,
          sku: 'VT-COT-004',
          stock: 15,
          fabric: 'Cotton',
          color: 'Mustard Yellow',
          colors: ['Yellow', 'Red'],
          sareeType: 'Handloom',
          weave: 'Ikat Handloom',
          blousePiece: true,
          isFeatured: false,
          isActive: true,
          ratings: 4.6,
          reviewCount: 24,
        },
      ];

      for (const item of initialSarees) {
        await SareeModel.create(item);
      }
      logger.info('Seeded initial sarees collection for store and admin');
    }

    // 4. Seed Coupons
    const couponCount = await CouponModel.countDocuments();
    if (couponCount === 0) {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);

      const coupons = [
        { code: 'FLASH5', discountType: 'percentage', discountValue: 5, minimumOrderValue: 2490, expiresAt: futureDate, isActive: true },
        { code: 'VINIT10', discountType: 'percentage', discountValue: 10, minimumOrderValue: 2999, expiresAt: futureDate, isActive: true },
        { code: 'FESTIVE15', discountType: 'percentage', discountValue: 15, minimumOrderValue: 4999, expiresAt: futureDate, isActive: true },
        { code: 'WELCOME5', discountType: 'percentage', discountValue: 5, minimumOrderValue: 1499, expiresAt: futureDate, isActive: true },
      ];

      for (const coup of coupons) {
        await CouponModel.create(coup);
      }
      logger.info('Seeded promotional coupons for ticker & admin');
    }
  } catch (err) {
    logger.error('Error during data seeding:', err);
  }
}
