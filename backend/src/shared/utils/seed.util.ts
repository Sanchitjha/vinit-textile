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
                "name": "Petrol Blue Gold Floral Embroidered Saree (VT-11029)",
                "slug": "petrol-blue-gold-floral-embroidered-saree-vt-11029",
                "description": "Authentic Surat handloom saree — premium Silk Blend fabric with festive-ready drape.",
                "category": silk,
                "images": [
                        "/product-images/categories/silk-saree/VT-11029/01.webp",
                        "/product-images/categories/silk-saree/VT-11029/02.webp",
                        "/product-images/categories/silk-saree/VT-11029/03.webp",
                        "/product-images/categories/silk-saree/VT-11029/04.webp",
                        "/product-images/categories/silk-saree/VT-11029/05.webp",
                        "/product-images/categories/silk-saree/VT-11029/06.webp"
                ],
                "price": 1500,
                "compareAtPrice": 2500,
                "discount": 40,
                "sku": "VT-11029",
                "stock": 10,
                "fabric": "Silk Blend",
                "color": "Petrol Blue",
                "colors": [
                        "Blue"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Royal Zari Woven Silk Saree (VT-12590)",
                "slug": "royal-zari-woven-silk-saree-vt-12590",
                "description": "Authentic Surat handloom saree — premium Silk fabric with festive-ready drape.",
                "category": silk,
                "images": [
                        "/product-images/categories/silk-saree/VT-12590/01.webp",
                        "/product-images/categories/silk-saree/VT-12590/02.webp",
                        "/product-images/categories/silk-saree/VT-12590/03.webp",
                        "/product-images/categories/silk-saree/VT-12590/04.webp"
                ],
                "price": 2590,
                "compareAtPrice": 3200,
                "discount": 19,
                "sku": "VT-12590",
                "stock": 10,
                "fabric": "Silk",
                "color": "Red & Gold",
                "colors": [
                        "Red",
                        "Gold"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Royal Zari Woven Silk Saree - Ruby Red Edition (VT-12590-V2)",
                "slug": "royal-zari-woven-silk-saree-ruby-red-edition-vt-12590-v2",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": silk,
                "images": [
                        "/product-images/categories/silk-saree/VT-12590-v2/01.webp",
                        "/product-images/categories/silk-saree/VT-12590-v2/02.webp",
                        "/product-images/categories/silk-saree/VT-12590-v2/03.webp",
                        "/product-images/categories/silk-saree/VT-12590-v2/04.webp"
                ],
                "price": 2590,
                "compareAtPrice": 3200,
                "discount": 19,
                "sku": "VT-12590-V2",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Ivory & Multicolour",
                "colors": [
                        "Beige",
                        "Multicolor"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Traditional Banarasi Silk Saree - Maroon (VT-1395)",
                "slug": "traditional-banarasi-silk-saree-maroon-vt-1395",
                "description": "Authentic Surat handloom saree — premium Banarasi Silk fabric with festive-ready drape.",
                "category": silk,
                "images": [
                        "/product-images/categories/silk-saree/VT-1395/01.webp",
                        "/product-images/categories/silk-saree/VT-1395/02.webp",
                        "/product-images/categories/silk-saree/VT-1395/03.webp",
                        "/product-images/categories/silk-saree/VT-1395/04.webp",
                        "/product-images/categories/silk-saree/VT-1395/05.webp"
                ],
                "price": 1395,
                "compareAtPrice": 1800,
                "discount": 23,
                "sku": "VT-1395",
                "stock": 10,
                "fabric": "Banarasi Silk",
                "color": "Maroon",
                "colors": [
                        "Maroon"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.8,
                "reviewCount": 25
        },
        {
                "name": "Traditional Banarasi Silk Saree - Purple Orchid (VT-1395-PUR)",
                "slug": "traditional-banarasi-silk-saree-purple-orchid-vt-1395-pur",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": silk,
                "images": [
                        "/product-images/categories/silk-saree/VT-1395-purple/01.webp",
                        "/product-images/categories/silk-saree/VT-1395-purple/02.webp",
                        "/product-images/categories/silk-saree/VT-1395-purple/03.webp",
                        "/product-images/categories/silk-saree/VT-1395-purple/04.webp",
                        "/product-images/categories/silk-saree/VT-1395-purple/05.webp"
                ],
                "price": 1395,
                "compareAtPrice": 1800,
                "discount": 23,
                "sku": "VT-1395-PUR",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Lavender",
                "colors": [
                        "Purple"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Pure Kanjivaram Style Brocade Silk Saree (VT-1565)",
                "slug": "pure-kanjivaram-style-brocade-silk-saree-vt-1565",
                "description": "Authentic Surat handloom saree — premium Kanjivaram Silk fabric with festive-ready drape.",
                "category": silk,
                "images": [
                        "/product-images/categories/silk-saree/VT-1565/01.webp",
                        "/product-images/categories/silk-saree/VT-1565/02.webp",
                        "/product-images/categories/silk-saree/VT-1565/03.webp",
                        "/product-images/categories/silk-saree/VT-1565/04.webp",
                        "/product-images/categories/silk-saree/VT-1565/05.webp"
                ],
                "price": 1565,
                "compareAtPrice": 2200,
                "discount": 29,
                "sku": "VT-1565",
                "stock": 10,
                "fabric": "Kanjivaram Silk",
                "color": "Purple & Gold",
                "colors": [
                        "Purple",
                        "Gold"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 5,
                "reviewCount": 25
        },
        {
                "name": "Pure Kanjivaram Brocade Silk Saree - Temple Motif Edition (VT-1565-V2)",
                "slug": "pure-kanjivaram-brocade-silk-saree-temple-motif-edition-vt-1565-v2",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": silk,
                "images": [
                        "/product-images/categories/silk-saree/VT-1565-v2/01.webp",
                        "/product-images/categories/silk-saree/VT-1565-v2/02.webp",
                        "/product-images/categories/silk-saree/VT-1565-v2/03.webp",
                        "/product-images/categories/silk-saree/VT-1565-v2/04.webp",
                        "/product-images/categories/silk-saree/VT-1565-v2/05.webp"
                ],
                "price": 1565,
                "compareAtPrice": 2200,
                "discount": 29,
                "sku": "VT-1565-V2",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Burnt Orange",
                "colors": [
                        "Orange"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 5,
                "reviewCount": 25
        },
        {
                "name": "Festive Chanderi Silk Zari Saree (VT-1599)",
                "slug": "festive-chanderi-silk-zari-saree-vt-1599",
                "description": "Authentic Surat handloom saree — premium Chanderi Silk fabric with festive-ready drape.",
                "category": silk,
                "images": [
                        "/product-images/categories/silk-saree/VT-1599/01.webp",
                        "/product-images/categories/silk-saree/VT-1599/02.webp",
                        "/product-images/categories/silk-saree/VT-1599/03.webp",
                        "/product-images/categories/silk-saree/VT-1599/04.webp",
                        "/product-images/categories/silk-saree/VT-1599/05.webp"
                ],
                "price": 1599,
                "compareAtPrice": 2250,
                "discount": 29,
                "sku": "VT-1599",
                "stock": 10,
                "fabric": "Chanderi Silk",
                "color": "Royal Blue",
                "colors": [
                        "Blue"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Festive Chanderi Silk Zari Saree - Peacock Weave (VT-1599-V2)",
                "slug": "festive-chanderi-silk-zari-saree-peacock-weave-vt-1599-v2",
                "description": "Authentic Surat handloom saree — premium Silk Blend fabric with festive-ready drape.",
                "category": silk,
                "images": [
                        "/product-images/categories/silk-saree/VT-1599-v2/01.webp",
                        "/product-images/categories/silk-saree/VT-1599-v2/02.webp",
                        "/product-images/categories/silk-saree/VT-1599-v2/03.webp",
                        "/product-images/categories/silk-saree/VT-1599-v2/04.webp",
                        "/product-images/categories/silk-saree/VT-1599-v2/05.webp"
                ],
                "price": 1599,
                "compareAtPrice": 2250,
                "discount": 29,
                "sku": "VT-1599-V2",
                "stock": 10,
                "fabric": "Silk Blend",
                "color": "Royal Blue",
                "colors": [
                        "Blue"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Festive Organza Zari Drape Saree (VT-1425)",
                "slug": "festive-organza-zari-drape-saree-vt-1425",
                "description": "Authentic Surat handloom saree — premium Organza fabric with festive-ready drape.",
                "category": organza,
                "images": [
                        "/product-images/categories/organza-saree/VT-1425/01.webp",
                        "/product-images/categories/organza-saree/VT-1425/02.webp",
                        "/product-images/categories/organza-saree/VT-1425/03.webp",
                        "/product-images/categories/organza-saree/VT-1425/04.webp",
                        "/product-images/categories/organza-saree/VT-1425/05.webp"
                ],
                "price": 1425,
                "compareAtPrice": 1900,
                "discount": 25,
                "sku": "VT-1425",
                "stock": 10,
                "fabric": "Organza",
                "color": "Blush Pink",
                "colors": [
                        "Pink"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.7,
                "reviewCount": 25
        },
        {
                "name": "Festive Organza Zari Drape Saree - Rose Gold Edition (VT-1425-V2)",
                "slug": "festive-organza-zari-drape-saree-rose-gold-edition-vt-1425-v2",
                "description": "Authentic Surat handloom saree — premium Shimmer Georgette fabric with festive-ready drape.",
                "category": organza,
                "images": [
                        "/product-images/categories/organza-saree/VT-1425-v2/01.webp",
                        "/product-images/categories/organza-saree/VT-1425-v2/02.webp",
                        "/product-images/categories/organza-saree/VT-1425-v2/03.webp",
                        "/product-images/categories/organza-saree/VT-1425-v2/04.webp",
                        "/product-images/categories/organza-saree/VT-1425-v2/05.webp"
                ],
                "price": 1425,
                "compareAtPrice": 1900,
                "discount": 25,
                "sku": "VT-1425-V2",
                "stock": 10,
                "fabric": "Shimmer Georgette",
                "color": "Mustard Green",
                "colors": [
                        "Green",
                        "Yellow"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.8,
                "reviewCount": 25
        },
        {
                "name": "Handloom Cotton Silk Floral Saree (VT-1460)",
                "slug": "handloom-cotton-silk-floral-saree-vt-1460",
                "description": "Authentic Surat handloom saree — premium Cotton Silk fabric with festive-ready drape.",
                "category": cotton,
                "images": [
                        "/product-images/categories/cotton-saree/VT-1460/01.webp",
                        "/product-images/categories/cotton-saree/VT-1460/02.webp",
                        "/product-images/categories/cotton-saree/VT-1460/03.webp",
                        "/product-images/categories/cotton-saree/VT-1460/04.webp",
                        "/product-images/categories/cotton-saree/VT-1460/05.webp"
                ],
                "price": 1460,
                "compareAtPrice": 1950,
                "discount": 25,
                "sku": "VT-1460",
                "stock": 10,
                "fabric": "Cotton Silk",
                "color": "Yellow",
                "colors": [
                        "Yellow"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.8,
                "reviewCount": 25
        },
        {
                "name": "Handloom Cotton Silk Floral Saree - Mustard Gold (VT-1460-V2)",
                "slug": "handloom-cotton-silk-floral-saree-mustard-gold-vt-1460-v2",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": cotton,
                "images": [
                        "/product-images/categories/cotton-saree/VT-1460-v2/01.webp",
                        "/product-images/categories/cotton-saree/VT-1460-v2/02.webp",
                        "/product-images/categories/cotton-saree/VT-1460-v2/03.webp",
                        "/product-images/categories/cotton-saree/VT-1460-v2/04.webp",
                        "/product-images/categories/cotton-saree/VT-1460-v2/05.webp"
                ],
                "price": 1460,
                "compareAtPrice": 1950,
                "discount": 25,
                "sku": "VT-1460-V2",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Crimson Red",
                "colors": [
                        "Red"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.8,
                "reviewCount": 25
        },
        {
                "name": "Mint Green Paisley Embroidered Saree (VT-12599)",
                "slug": "mint-green-paisley-embroidered-saree-vt-12599",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": georgette,
                "images": [
                        "/product-images/categories/georgette-saree/VT-12599/01.webp",
                        "/product-images/categories/georgette-saree/VT-12599/02.webp",
                        "/product-images/categories/georgette-saree/VT-12599/03.webp",
                        "/product-images/categories/georgette-saree/VT-12599/04.webp",
                        "/product-images/categories/georgette-saree/VT-12599/05.webp"
                ],
                "price": 3000,
                "compareAtPrice": 4500,
                "discount": 33,
                "sku": "VT-12599",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Mint Green",
                "colors": [
                        "Green"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Georgette Micro-Sequin Border Saree (VT-1470)",
                "slug": "georgette-micro-sequin-border-saree-vt-1470",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": georgette,
                "images": [
                        "/product-images/categories/georgette-saree/VT-1470/01.webp",
                        "/product-images/categories/georgette-saree/VT-1470/02.webp",
                        "/product-images/categories/georgette-saree/VT-1470/03.webp",
                        "/product-images/categories/georgette-saree/VT-1470/04.webp",
                        "/product-images/categories/georgette-saree/VT-1470/05.webp"
                ],
                "price": 1470,
                "compareAtPrice": 1990,
                "discount": 26,
                "sku": "VT-1470",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Emerald Green",
                "colors": [
                        "Green"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Georgette Micro-Sequin Border Saree - Jade Emerald (VT-1470-V2)",
                "slug": "georgette-micro-sequin-border-saree-jade-emerald-vt-1470-v2",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": georgette,
                "images": [
                        "/product-images/categories/georgette-saree/VT-1470-v2/01.webp",
                        "/product-images/categories/georgette-saree/VT-1470-v2/02.webp",
                        "/product-images/categories/georgette-saree/VT-1470-v2/03.webp",
                        "/product-images/categories/georgette-saree/VT-1470-v2/04.webp",
                        "/product-images/categories/georgette-saree/VT-1470-v2/05.webp"
                ],
                "price": 1470,
                "compareAtPrice": 1990,
                "discount": 26,
                "sku": "VT-1470-V2",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Red",
                "colors": [
                        "Red"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Grey Printed Saree with Folk Art Border (VTLR-1499)",
                "slug": "grey-printed-saree-with-folk-art-border-vtlr-1499",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": georgette,
                "images": [
                        "/product-images/categories/georgette-saree/VTLR-1499/01.webp",
                        "/product-images/categories/georgette-saree/VTLR-1499/02.webp",
                        "/product-images/categories/georgette-saree/VTLR-1499/03.webp",
                        "/product-images/categories/georgette-saree/VTLR-1499/04.webp",
                        "/product-images/categories/georgette-saree/VTLR-1499/05.webp"
                ],
                "price": 1499,
                "compareAtPrice": 2100,
                "discount": 29,
                "sku": "VTLR-1499",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Grey",
                "colors": [
                        "Grey"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.8,
                "reviewCount": 25
        },
        {
                "name": "Designer Partywear Embroidered Saree - Dusty Rose (VT-1499)",
                "slug": "designer-partywear-embroidered-saree-dusty-rose-vt-1499",
                "description": "Authentic Surat handloom saree — premium Silk Blend fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1499/01.webp",
                        "/product-images/categories/partywear/VT-1499/02.webp",
                        "/product-images/categories/partywear/VT-1499/03.webp"
                ],
                "price": 1499,
                "compareAtPrice": 2100,
                "discount": 29,
                "sku": "VT-1499",
                "stock": 10,
                "fabric": "Silk Blend",
                "color": "Teal Blue",
                "colors": [
                        "Teal"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.8,
                "reviewCount": 25
        },
        {
                "name": "Designer Partywear Embroidered Saree - Sunshine Yellow (VT-1499-YEL)",
                "slug": "designer-partywear-embroidered-saree-sunshine-yellow-vt-1499-yel",
                "description": "Authentic Surat handloom saree — premium Shimmer Georgette fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1499-yellow/01.webp",
                        "/product-images/categories/partywear/VT-1499-yellow/02.webp",
                        "/product-images/categories/partywear/VT-1499-yellow/03.webp",
                        "/product-images/categories/partywear/VT-1499-yellow/04.webp",
                        "/product-images/categories/partywear/VT-1499-yellow/05.webp"
                ],
                "price": 1499,
                "compareAtPrice": 2100,
                "discount": 29,
                "sku": "VT-1499-YEL",
                "stock": 10,
                "fabric": "Shimmer Georgette",
                "color": "Olive Green",
                "colors": [
                        "Green"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Designer Partywear Embroidered Saree - Ocean Blue (VT-1499-BLU)",
                "slug": "designer-partywear-embroidered-saree-ocean-blue-vt-1499-blu",
                "description": "Authentic Surat handloom saree — premium Shimmer Georgette fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1499-blue/01.webp",
                        "/product-images/categories/partywear/VT-1499-blue/02.webp",
                        "/product-images/categories/partywear/VT-1499-blue/03.webp",
                        "/product-images/categories/partywear/VT-1499-blue/04.webp",
                        "/product-images/categories/partywear/VT-1499-blue/05.webp"
                ],
                "price": 1499,
                "compareAtPrice": 2100,
                "discount": 29,
                "sku": "VT-1499-BLU",
                "stock": 10,
                "fabric": "Shimmer Georgette",
                "color": "Rose Brown",
                "colors": [
                        "Brown"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.8,
                "reviewCount": 25
        },
        {
                "name": "Designer Partywear Embroidered Saree - Emerald Green (VT-1499-GRN)",
                "slug": "designer-partywear-embroidered-saree-emerald-green-vt-1499-grn",
                "description": "Authentic Surat handloom saree — premium Shimmer Georgette fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1499-green/01.webp",
                        "/product-images/categories/partywear/VT-1499-green/02.webp",
                        "/product-images/categories/partywear/VT-1499-green/03.webp",
                        "/product-images/categories/partywear/VT-1499-green/04.webp",
                        "/product-images/categories/partywear/VT-1499-green/05.webp"
                ],
                "price": 1499,
                "compareAtPrice": 2100,
                "discount": 29,
                "sku": "VT-1499-GRN",
                "stock": 10,
                "fabric": "Shimmer Georgette",
                "color": "Powder Blue",
                "colors": [
                        "Blue"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Designer Partywear Embroidered Saree - Royal Purple (VT-1499-PUR)",
                "slug": "designer-partywear-embroidered-saree-royal-purple-vt-1499-pur",
                "description": "Authentic Surat handloom saree — premium Shimmer Georgette fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1499-purple/01.webp",
                        "/product-images/categories/partywear/VT-1499-purple/02.webp",
                        "/product-images/categories/partywear/VT-1499-purple/03.webp",
                        "/product-images/categories/partywear/VT-1499-purple/04.webp"
                ],
                "price": 1499,
                "compareAtPrice": 2100,
                "discount": 29,
                "sku": "VT-1499-PUR",
                "stock": 10,
                "fabric": "Shimmer Georgette",
                "color": "Sunshine Yellow",
                "colors": [
                        "Yellow"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Sky Blue Bead & Sequin Stripe Net Saree (VT-1525-BLUE)",
                "slug": "sky-blue-bead-sequin-stripe-net-saree-vt-1525-blue",
                "description": "Authentic Surat handloom saree — premium Net fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1525-blue/01.webp",
                        "/product-images/categories/partywear/VT-1525-blue/02.webp",
                        "/product-images/categories/partywear/VT-1525-blue/03.webp",
                        "/product-images/categories/partywear/VT-1525-blue/04.webp",
                        "/product-images/categories/partywear/VT-1525-blue/05.webp"
                ],
                "price": 1199,
                "compareAtPrice": 2100,
                "discount": 43,
                "sku": "VT-1525-BLUE",
                "stock": 10,
                "fabric": "Net",
                "color": "Sky Blue",
                "colors": [
                        "Blue"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.8,
                "reviewCount": 25
        },
        {
                "name": "Sage Green Bead & Sequin Stripe Net Saree (VT-1525-GREEN)",
                "slug": "sage-green-bead-sequin-stripe-net-saree-vt-1525-green",
                "description": "Authentic Surat handloom saree — premium Net fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1525-green/01.webp",
                        "/product-images/categories/partywear/VT-1525-green/02.webp",
                        "/product-images/categories/partywear/VT-1525-green/03.webp",
                        "/product-images/categories/partywear/VT-1525-green/04.webp"
                ],
                "price": 1199,
                "compareAtPrice": 2100,
                "discount": 43,
                "sku": "VT-1525-GREEN",
                "stock": 10,
                "fabric": "Net",
                "color": "Sage Green",
                "colors": [
                        "Green"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.8,
                "reviewCount": 25
        },
        {
                "name": "Lilac Pink Bead & Sequin Stripe Net Saree (VT-1525-PINK)",
                "slug": "lilac-pink-bead-sequin-stripe-net-saree-vt-1525-pink",
                "description": "Authentic Surat handloom saree — premium Net fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1525-pink/01.webp",
                        "/product-images/categories/partywear/VT-1525-pink/02.webp",
                        "/product-images/categories/partywear/VT-1525-pink/03.webp",
                        "/product-images/categories/partywear/VT-1525-pink/04.webp",
                        "/product-images/categories/partywear/VT-1525-pink/05.webp"
                ],
                "price": 1199,
                "compareAtPrice": 2100,
                "discount": 43,
                "sku": "VT-1525-PINK",
                "stock": 10,
                "fabric": "Net",
                "color": "Lilac Pink",
                "colors": [
                        "Pink",
                        "Purple"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Steel Blue Beaded Net Saree with Scalloped Border (VT-1625)",
                "slug": "steel-blue-beaded-net-saree-with-scalloped-border-vt-1625",
                "description": "Authentic Surat handloom saree — premium Net fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1625/01.webp",
                        "/product-images/categories/partywear/VT-1625/02.webp",
                        "/product-images/categories/partywear/VT-1625/03.webp",
                        "/product-images/categories/partywear/VT-1625/04.webp",
                        "/product-images/categories/partywear/VT-1625/05.webp"
                ],
                "price": 1399,
                "compareAtPrice": 2300,
                "discount": 39,
                "sku": "VT-1625",
                "stock": 10,
                "fabric": "Net",
                "color": "Steel Blue",
                "colors": [
                        "Blue",
                        "Grey"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Sage Green Beaded Net Saree with Scalloped Border (VT-1625-GREEN)",
                "slug": "sage-green-beaded-net-saree-with-scalloped-border-vt-1625-green",
                "description": "Authentic Surat handloom saree — premium Net fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1625-green/01.webp",
                        "/product-images/categories/partywear/VT-1625-green/02.webp",
                        "/product-images/categories/partywear/VT-1625-green/03.webp",
                        "/product-images/categories/partywear/VT-1625-green/04.webp",
                        "/product-images/categories/partywear/VT-1625-green/05.webp"
                ],
                "price": 1399,
                "compareAtPrice": 2300,
                "discount": 39,
                "sku": "VT-1625-GREEN",
                "stock": 10,
                "fabric": "Net",
                "color": "Sage Green",
                "colors": [
                        "Green"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Rust Orange Beaded Net Saree with Scalloped Border (VT-1625-ORANGE)",
                "slug": "rust-orange-beaded-net-saree-with-scalloped-border-vt-1625-orange",
                "description": "Authentic Surat handloom saree — premium Net fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1625-orange/01.webp",
                        "/product-images/categories/partywear/VT-1625-orange/02.webp",
                        "/product-images/categories/partywear/VT-1625-orange/03.webp",
                        "/product-images/categories/partywear/VT-1625-orange/04.webp",
                        "/product-images/categories/partywear/VT-1625-orange/05.webp"
                ],
                "price": 1399,
                "compareAtPrice": 2300,
                "discount": 39,
                "sku": "VT-1625-ORANGE",
                "stock": 10,
                "fabric": "Net",
                "color": "Rust Orange",
                "colors": [
                        "Orange",
                        "Brown"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Orchid Pink Beaded Net Saree with Scalloped Border (VT-1625-PINK)",
                "slug": "orchid-pink-beaded-net-saree-with-scalloped-border-vt-1625-pink",
                "description": "Authentic Surat handloom saree — premium Net fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1625-pink/01.webp",
                        "/product-images/categories/partywear/VT-1625-pink/02.webp",
                        "/product-images/categories/partywear/VT-1625-pink/03.webp",
                        "/product-images/categories/partywear/VT-1625-pink/04.webp",
                        "/product-images/categories/partywear/VT-1625-pink/05.webp"
                ],
                "price": 1399,
                "compareAtPrice": 2300,
                "discount": 39,
                "sku": "VT-1625-PINK",
                "stock": 10,
                "fabric": "Net",
                "color": "Orchid Pink",
                "colors": [
                        "Pink"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Dusty Lavender Beaded Net Saree with Scalloped Border (VT-1625-PURPLE)",
                "slug": "dusty-lavender-beaded-net-saree-with-scalloped-border-vt-1625-purple",
                "description": "Authentic Surat handloom saree — premium Net fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1625-purple/01.webp",
                        "/product-images/categories/partywear/VT-1625-purple/02.webp",
                        "/product-images/categories/partywear/VT-1625-purple/03.webp",
                        "/product-images/categories/partywear/VT-1625-purple/04.webp",
                        "/product-images/categories/partywear/VT-1625-purple/05.webp"
                ],
                "price": 1399,
                "compareAtPrice": 2300,
                "discount": 39,
                "sku": "VT-1625-PURPLE",
                "stock": 10,
                "fabric": "Net",
                "color": "Dusty Lavender",
                "colors": [
                        "Purple"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Mustard Yellow Beaded Net Saree with Scalloped Border (VT-1625-YELLOW)",
                "slug": "mustard-yellow-beaded-net-saree-with-scalloped-border-vt-1625-yellow",
                "description": "Authentic Surat handloom saree — premium Net fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-1625-yellow/01.webp",
                        "/product-images/categories/partywear/VT-1625-yellow/02.webp",
                        "/product-images/categories/partywear/VT-1625-yellow/03.webp",
                        "/product-images/categories/partywear/VT-1625-yellow/04.webp",
                        "/product-images/categories/partywear/VT-1625-yellow/05.webp"
                ],
                "price": 1399,
                "compareAtPrice": 2300,
                "discount": 39,
                "sku": "VT-1625-YELLOW",
                "stock": 10,
                "fabric": "Net",
                "color": "Mustard Yellow",
                "colors": [
                        "Yellow"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Plum Purple Designer Partywear Saree (VT-2860)",
                "slug": "plum-purple-designer-partywear-saree-vt-2860",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": party,
                "images": [
                        "/product-images/categories/partywear/VT-2860/01.webp",
                        "/product-images/categories/partywear/VT-2860/02.webp",
                        "/product-images/categories/partywear/VT-2860/03.webp",
                        "/product-images/categories/partywear/VT-2860/04.webp"
                ],
                "price": 1999,
                "compareAtPrice": 2600,
                "discount": 23,
                "sku": "VT-2860",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Plum Purple",
                "colors": [
                        "Purple"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 4.9,
                "reviewCount": 25
        },
        {
                "name": "Ivory Pink Floral Georgette Saree (VT-1699)",
                "slug": "ivory-pink-floral-georgette-saree-vt-1699",
                "description": "Authentic Surat handloom saree — premium Georgette fabric with festive-ready drape.",
                "category": bridal,
                "images": [
                        "/product-images/categories/bridal-saree/VT-1699/01.webp",
                        "/product-images/categories/bridal-saree/VT-1699/02.webp",
                        "/product-images/categories/bridal-saree/VT-1699/03.webp",
                        "/product-images/categories/bridal-saree/VT-1699/04.webp",
                        "/product-images/categories/bridal-saree/VT-1699/05.webp"
                ],
                "price": 1299,
                "compareAtPrice": 2400,
                "discount": 46,
                "sku": "VT-1699",
                "stock": 10,
                "fabric": "Georgette",
                "color": "Ivory & Pink",
                "colors": [
                        "White",
                        "Pink"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 5,
                "reviewCount": 25
        },
        {
                "name": "Royal Velvet Floral Weave Saree (VT-1699-FLW)",
                "slug": "royal-velvet-floral-weave-saree-vt-1699-flw",
                "description": "Authentic Surat handloom saree — premium Silk Velvet fabric with festive-ready drape.",
                "category": bridal,
                "images": [
                        "/product-images/categories/bridal-saree/VT-1699-flowers/01.webp",
                        "/product-images/categories/bridal-saree/VT-1699-flowers/02.webp",
                        "/product-images/categories/bridal-saree/VT-1699-flowers/03.webp",
                        "/product-images/categories/bridal-saree/VT-1699-flowers/04.webp"
                ],
                "price": 1699,
                "compareAtPrice": 2400,
                "discount": 29,
                "sku": "VT-1699-FLW",
                "stock": 10,
                "fabric": "Silk Velvet",
                "color": "Deep Red",
                "colors": [
                        "Red"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 5,
                "reviewCount": 25
        },
        {
                "name": "Royal Velvet Border Silk Saree - Cocoa Brown (VT-1699-BRN)",
                "slug": "royal-velvet-border-silk-saree-cocoa-brown-vt-1699-brn",
                "description": "Authentic Surat handloom saree — premium Silk Velvet fabric with festive-ready drape.",
                "category": bridal,
                "images": [
                        "/product-images/categories/bridal-saree/VT-1699-brown/01.webp",
                        "/product-images/categories/bridal-saree/VT-1699-brown/02.webp",
                        "/product-images/categories/bridal-saree/VT-1699-brown/03.webp",
                        "/product-images/categories/bridal-saree/VT-1699-brown/04.webp",
                        "/product-images/categories/bridal-saree/VT-1699-brown/05.webp"
                ],
                "price": 1699,
                "compareAtPrice": 2400,
                "discount": 29,
                "sku": "VT-1699-BRN",
                "stock": 10,
                "fabric": "Silk Velvet",
                "color": "Cocoa Brown",
                "colors": [
                        "Brown"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 5,
                "reviewCount": 25
        },
        {
                "name": "Royal Velvet Heritage Elephant Motif Saree (VT-1699-ELP)",
                "slug": "royal-velvet-heritage-elephant-motif-saree-vt-1699-elp",
                "description": "Authentic Surat handloom saree — premium Silk Velvet fabric with festive-ready drape.",
                "category": bridal,
                "images": [
                        "/product-images/categories/bridal-saree/VT-1699-elephant/01.webp",
                        "/product-images/categories/bridal-saree/VT-1699-elephant/02.webp",
                        "/product-images/categories/bridal-saree/VT-1699-elephant/03.webp",
                        "/product-images/categories/bridal-saree/VT-1699-elephant/04.webp"
                ],
                "price": 1699,
                "compareAtPrice": 2400,
                "discount": 29,
                "sku": "VT-1699-ELP",
                "stock": 10,
                "fabric": "Silk Velvet",
                "color": "Maroon",
                "colors": [
                        "Maroon"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 5,
                "reviewCount": 25
        },
        {
                "name": "Premium Bridal Trousseau Velvet Saree (VT-1855)",
                "slug": "premium-bridal-trousseau-velvet-saree-vt-1855",
                "description": "Authentic Surat handloom saree — premium Velvet Silk fabric with festive-ready drape.",
                "category": bridal,
                "images": [
                        "/product-images/categories/bridal-saree/VT-1855/01.webp",
                        "/product-images/categories/bridal-saree/VT-1855/02.webp",
                        "/product-images/categories/bridal-saree/VT-1855/03.webp",
                        "/product-images/categories/bridal-saree/VT-1855/04.webp"
                ],
                "price": 1855,
                "compareAtPrice": 2600,
                "discount": 29,
                "sku": "VT-1855",
                "stock": 10,
                "fabric": "Velvet Silk",
                "color": "Crimson Maroon",
                "colors": [
                        "Maroon"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 5,
                "reviewCount": 25
        },
        {
                "name": "Mustard Yellow Floral Embroidered Saree - Design 2 (VT-1855-V2)",
                "slug": "mustard-yellow-floral-embroidered-saree-design-2-vt-1855-v2",
                "description": "Authentic Surat handloom saree — premium Silk Blend fabric with festive-ready drape.",
                "category": bridal,
                "images": [
                        "/product-images/categories/bridal-saree/VT-1855-v2/01.webp",
                        "/product-images/categories/bridal-saree/VT-1855-v2/02.webp",
                        "/product-images/categories/bridal-saree/VT-1855-v2/03.webp",
                        "/product-images/categories/bridal-saree/VT-1855-v2/04.webp",
                        "/product-images/categories/bridal-saree/VT-1855-v2/05.webp"
                ],
                "price": 1799,
                "compareAtPrice": 2600,
                "discount": 31,
                "sku": "VT-1855-V2",
                "stock": 10,
                "fabric": "Silk Blend",
                "color": "Mustard Yellow",
                "colors": [
                        "Yellow"
                ],
                "blousePiece": true,
                "isFeatured": true,
                "isActive": true,
                "ratings": 5,
                "reviewCount": 25
        }
];

      // Upsert products by SKU so Atlas database items are cleanly refreshed
      for (const item of initialSarees) {
        // $setOnInsert: create missing products but never overwrite edits made in the admin panel
        await SareeModel.findOneAndUpdate({ sku: item.sku }, { $setOnInsert: item }, { upsert: true, new: true });
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
