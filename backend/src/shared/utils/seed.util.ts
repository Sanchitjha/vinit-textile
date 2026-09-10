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
    if (sareeCategory) {
      // Fetch specific category IDs for proper filtering
      const silkCat    = await CategoryModel.findOne({ slug: 'silk-saree' });
      const organzaCat = await CategoryModel.findOne({ slug: 'organza-saree' });
      const cottonCat  = await CategoryModel.findOne({ slug: 'cotton-saree' });
      const georgetCat = await CategoryModel.findOne({ slug: 'georgette-saree' });
      const partyCat   = await CategoryModel.findOne({ slug: 'partywear' });
      const bridalCat  = await CategoryModel.findOne({ slug: 'bridal-saree' });

      // Fallback to generic 'saree' if a specific one isn't found
      const silk    = (silkCat    ?? sareeCategory)._id;
      const organza = (organzaCat ?? sareeCategory)._id;
      const cotton  = (cottonCat  ?? sareeCategory)._id;
      const georgette = (georgetCat ?? sareeCategory)._id;
      const party   = (partyCat   ?? sareeCategory)._id;
      const bridal  = (bridalCat  ?? sareeCategory)._id;

      const initialSarees = [
        {
          name: 'Royal Zari Woven Silk Saree (VT-12590)',
          slug: 'royal-zari-woven-silk-saree-vt-12590',
          description: 'Authentic Surat handloom silk saree with intricate floral zari weave border.',
          category: silk,
          images: [
            '/product-images/categories/silk-saree/VT-12590/01.png',
            '/product-images/categories/silk-saree/VT-12590/02.png',
            '/product-images/categories/silk-saree/VT-12590/03.png',
            '/product-images/categories/silk-saree/VT-12590/04.png',
          ],
          price: 2590,
          compareAtPrice: 3200,
          discount: 19,
          sku: 'VT-12590',
          stock: 12,
          fabric: 'Silk',
          color: 'Red & Gold',
          colors: ['Red', 'Gold'],
          sareeType: 'Banarasi',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.9,
          reviewCount: 48,
        },
        {
          name: 'Traditional Banarasi Silk Saree (VT-1395)',
          slug: 'traditional-banarasi-silk-saree-vt-1395',
          description: 'Rich Banarasi weave in vibrant festive colors woven by master artisans.',
          category: silk,
          images: [
            '/product-images/categories/silk-saree/VT-1395/01.jpg',
            '/product-images/categories/silk-saree/VT-1395/02.jpg',
            '/product-images/categories/silk-saree/VT-1395/03.jpg',
            '/product-images/categories/silk-saree/VT-1395/04.jpg',
            '/product-images/categories/silk-saree/VT-1395/05.jpg',
          ],
          price: 1395,
          compareAtPrice: 1800,
          discount: 22,
          sku: 'VT-1395',
          stock: 15,
          fabric: 'Banarasi Silk',
          color: 'Maroon',
          colors: ['Maroon'],
          sareeType: 'Banarasi',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.8,
          reviewCount: 36,
        },
        {
          name: 'Festive Organza Zari Drape Saree (VT-1425)',
          slug: 'festive-organza-zari-drape-saree-vt-1425',
          description: 'Sheer lightweight organza drape adorned with delicate zari accents.',
          category: organza,
          images: [
            '/product-images/categories/organza-saree/VT-1425/01.jpg',
            '/product-images/categories/organza-saree/VT-1425/02.jpg',
            '/product-images/categories/organza-saree/VT-1425/03.png',
            '/product-images/categories/organza-saree/VT-1425/04.jpg',
            '/product-images/categories/organza-saree/VT-1425/05.jpg',
          ],
          price: 1425,
          compareAtPrice: 1900,
          discount: 25,
          sku: 'VT-1425',
          stock: 8,
          fabric: 'Organza',
          color: 'Blush Pink',
          colors: ['Pink'],
          sareeType: 'Organza',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.7,
          reviewCount: 22,
        },
        {
          name: 'Handloom Cotton Silk Floral Saree (VT-1460)',
          slug: 'handloom-cotton-silk-floral-saree-vt-1460',
          description: 'Breathable handloom cotton silk with subtle metallic thread floral motifs.',
          category: cotton,
          images: [
            '/product-images/categories/cotton-saree/VT-1460/01.png',
            '/product-images/categories/cotton-saree/VT-1460/02.png',
            '/product-images/categories/cotton-saree/VT-1460/03.png',
            '/product-images/categories/cotton-saree/VT-1460/04.png',
            '/product-images/categories/cotton-saree/VT-1460/05.png',
          ],
          price: 1460,
          compareAtPrice: 1950,
          discount: 25,
          sku: 'VT-1460',
          stock: 10,
          fabric: 'Cotton Silk',
          color: 'Yellow',
          colors: ['Yellow'],
          sareeType: 'Handloom',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.8,
          reviewCount: 31,
        },
        {
          name: 'Georgette Micro-Sequin Border Saree (VT-1470)',
          slug: 'georgette-micro-sequin-border-saree-vt-1470',
          description: 'Airy georgette saree featuring a brilliant micro-sequin embroidered border.',
          category: georgette,
          images: [
            '/product-images/categories/georgette-saree/VT-1470/01.png',
            '/product-images/categories/georgette-saree/VT-1470/02.png',
            '/product-images/categories/georgette-saree/VT-1470/03.png',
            '/product-images/categories/georgette-saree/VT-1470/04.png',
            '/product-images/categories/georgette-saree/VT-1470/05.png',
          ],
          price: 1470,
          compareAtPrice: 1990,
          discount: 26,
          sku: 'VT-1470',
          stock: 6,
          fabric: 'Georgette',
          color: 'Emerald Green',
          colors: ['Green'],
          sareeType: 'Partywear',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.9,
          reviewCount: 42,
        },
        {
          name: 'Designer Partywear Embroidered Saree (VT-1499)',
          slug: 'designer-partywear-embroidered-saree-vt-1499',
          description: 'Contemporary partywear drape with handcrafted embroidery work.',
          category: party,
          images: [
            '/product-images/categories/partywear/VT-1499/01.png',
            '/product-images/categories/partywear/VT-1499/02.png',
            '/product-images/categories/partywear/VT-1499/03.png',
            '/product-images/categories/partywear/VT-1499/04.png',
          ],
          price: 1499,
          compareAtPrice: 2100,
          discount: 28,
          sku: 'VT-1499',
          stock: 14,
          fabric: 'Silk Blend',
          color: 'Teal Blue',
          colors: ['Teal'],
          sareeType: 'Designer',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.8,
          reviewCount: 29,
        },
        {
          name: 'Pure Kanjivaram Style Brocade Silk Saree (VT-1565)',
          slug: 'pure-kanjivaram-style-brocade-silk-saree-vt-1565',
          description: 'Grand Kanjivaram style temple border woven silk saree.',
          category: silk,
          images: [
            '/product-images/categories/silk-saree/VT-1565/01.png',
            '/product-images/categories/silk-saree/VT-1565/02.png',
            '/product-images/categories/silk-saree/VT-1565/03.png',
            '/product-images/categories/silk-saree/VT-1565/04.png',
            '/product-images/categories/silk-saree/VT-1565/05.png',
          ],
          price: 1565,
          compareAtPrice: 2200,
          discount: 28,
          sku: 'VT-1565',
          stock: 9,
          fabric: 'Kanjivaram Silk',
          color: 'Purple & Gold',
          colors: ['Purple', 'Gold'],
          sareeType: 'Kanjivaram',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 5.0,
          reviewCount: 54,
        },
        {
          name: 'Festive Chanderi Silk Zari Saree (VT-1599)',
          slug: 'festive-chanderi-silk-zari-saree-vt-1599',
          description: 'Lustrous Chanderi silk drape woven with traditional peacock motifs.',
          category: silk,
          images: [
            '/product-images/categories/silk-saree/VT-1599/01.png',
            '/product-images/categories/silk-saree/VT-1599/02.png',
            '/product-images/categories/silk-saree/VT-1599/03.png',
            '/product-images/categories/silk-saree/VT-1599/04.png',
            '/product-images/categories/silk-saree/VT-1599/05.png',
          ],
          price: 1599,
          compareAtPrice: 2250,
          discount: 29,
          sku: 'VT-1599',
          stock: 11,
          fabric: 'Chanderi Silk',
          color: 'Royal Blue',
          colors: ['Blue'],
          sareeType: 'Chanderi',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 4.9,
          reviewCount: 38,
        },
        {
          name: 'Royal Velvet Border Handwoven Saree (VT-1699)',
          slug: 'royal-velvet-border-handwoven-saree-vt-1699',
          description: 'Opulent bridal drape with rich velvet border and intricate threadwork.',
          category: bridal,
          images: [
            '/product-images/categories/bridal-saree/VT-1699/01.jpg',
            '/product-images/categories/bridal-saree/VT-1699/02.jpg',
            '/product-images/categories/bridal-saree/VT-1699/03.png',
            '/product-images/categories/bridal-saree/VT-1699/04.jpg',
            '/product-images/categories/bridal-saree/VT-1699/05.jpg',
          ],
          price: 1699,
          compareAtPrice: 2400,
          discount: 29,
          sku: 'VT-1699',
          stock: 7,
          fabric: 'Silk Velvet',
          color: 'Deep Red',
          colors: ['Red'],
          sareeType: 'Bridal',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 5.0,
          reviewCount: 62,
        },
        {
          name: 'Premium Bridal Trousseau Velvet Saree (VT-1855)',
          slug: 'premium-bridal-trousseau-velvet-saree-vt-1855',
          description: 'Exclusive bridal trousseau saree with heavy zardozi embroidery.',
          category: bridal,
          images: [
            '/product-images/categories/bridal-saree/VT-1855/01.png',
            '/product-images/categories/bridal-saree/VT-1855/02.png',
            '/product-images/categories/bridal-saree/VT-1855/03.png',
            '/product-images/categories/bridal-saree/VT-1855/04.png',
          ],
          price: 1855,
          compareAtPrice: 2600,
          discount: 28,
          sku: 'VT-1855',
          stock: 5,
          fabric: 'Velvet Silk',
          color: 'Crimson Maroon',
          colors: ['Maroon'],
          sareeType: 'Bridal',
          blousePiece: true,
          isFeatured: true,
          isActive: true,
          ratings: 5.0,
          reviewCount: 71,
        },
      ];

      // Upsert products by SKU so Atlas database items are cleanly refreshed
      for (const item of initialSarees) {
        await SareeModel.findOneAndUpdate({ sku: item.sku }, item, { upsert: true, new: true });
      }
      logger.info('Seeded and synchronized initial sarees collection in MongoDB Atlas');
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
