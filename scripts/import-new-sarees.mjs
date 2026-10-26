import fs from 'fs';
import path from 'path';

const API = process.env.API_URL || 'https://vinit-textile.onrender.com/api/v1';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@vinittextiles.com';
const PASSWORD = process.env.ADMIN_PASS || 'admin123';

const CATEGORIES = {
  bridal: '6a9e70a77fbd7f56ac65b4d0',
  partywear: '6a9e70a77fbd7f56ac65b4d1',
  silk: '6a9e70a77fbd7f56ac65b4cf',
  saree: '6a9e70a77fbd7f56ac65b4ce',
};

const NEW_PRODUCTS = [
  {
    sku: 'VT-1899-KARWACHAUTH',
    name: 'Karwa Chauth Special Heavy Embellished Saree (VT-1899)',
    description: 'An exclusive Karwa Chauth collection heavy saree featuring intricate gold zari and thread embroidery. Designed for auspicious celebrations and bridal elegance.',
    category: CATEGORIES.bridal,
    price: 1899,
    compareAtPrice: 2499,
    discount: 24,
    fabric: 'Silk Blend',
    sareeType: 'Bridal',
    color: 'Crimson Red',
    colors: ['Red'],
    stock: 15,
    relPath: 'bridal-saree/VT-1899-karwachauth',
    occasion: ['Bridal', 'Karwa Chauth', 'Festive'],
    isFeatured: true,
    isBestseller: true,
  },
  {
    sku: 'VT-1699-LADY-MAROON',
    name: 'Lady Maroon Embroidered Bridal Saree (VT-1699-MRN)',
    description: 'A regal deep maroon bridal saree with detailed zardozi and scalloped embroidery. Perfect for wedding ceremonies and grand evening receptions.',
    category: CATEGORIES.bridal,
    price: 1699,
    compareAtPrice: 2299,
    discount: 26,
    fabric: 'Velvet Silk',
    sareeType: 'Bridal',
    color: 'Maroon',
    colors: ['Maroon'],
    stock: 12,
    relPath: 'bridal-saree/VT-1699-lady-maroon',
    occasion: ['Bridal', 'Wedding Guest', 'Festive'],
    isFeatured: true,
    isBestseller: true,
  },
  {
    sku: 'VT-1875-GREY',
    name: 'Handwork Heavy Bridal Saree - Slate Grey (VT-1875-GRY)',
    description: 'Exquisite handcrafted heavy embroidery saree in a sophisticated slate grey tone. Features ornate border and scattered buttis for reception wear.',
    category: CATEGORIES.bridal,
    price: 1875,
    compareAtPrice: 2500,
    discount: 25,
    fabric: 'Organza Silk',
    sareeType: 'Designer',
    color: 'Slate Grey',
    colors: ['Grey'],
    stock: 10,
    relPath: 'bridal-saree/VT-1875-grey',
    occasion: ['Reception', 'Cocktail', 'Party'],
    isFeatured: true,
    isBestseller: false,
  },
  {
    sku: 'VT-1875-RUST',
    name: 'Handwork Heavy Festive Saree - Rust Orange (VT-1875-RST)',
    description: 'Vibrant rust orange heavy handwork saree with golden thread and sequin craftsmanship. A statement piece for festive celebrations.',
    category: CATEGORIES.bridal,
    price: 1875,
    compareAtPrice: 2500,
    discount: 25,
    fabric: 'Organza Silk',
    sareeType: 'Designer',
    color: 'Rust Orange',
    colors: ['Orange'],
    stock: 10,
    relPath: 'bridal-saree/VT-1875-rust-orange',
    occasion: ['Festive', 'Wedding', 'Puja'],
    isFeatured: true,
    isBestseller: true,
  },
  {
    sku: 'VT-1875-TEAL',
    name: 'Handwork Heavy Bridal Saree - Royal Teal (VT-1875-TEL)',
    description: 'Royal teal handwork heavy saree with intricate sequin embellishments and ornate pallu drape. Rich, opulent, and grand.',
    category: CATEGORIES.bridal,
    price: 1875,
    compareAtPrice: 2500,
    discount: 25,
    fabric: 'Organza Silk',
    sareeType: 'Designer',
    color: 'Royal Teal',
    colors: ['Teal', 'Blue'],
    stock: 10,
    relPath: 'bridal-saree/VT-1875-teal',
    occasion: ['Reception', 'Party', 'Wedding'],
    isFeatured: true,
    isBestseller: false,
  },
  {
    sku: 'VT-1875-BLUE',
    name: 'Handwork Heavy Bridal Saree - Midnight Blue (VT-1875-BLU)',
    description: 'Midnight blue heavy embroidered saree with silver and gold zari motifs. Designed to dazzle at cocktail nights and receptions.',
    category: CATEGORIES.bridal,
    price: 1875,
    compareAtPrice: 2500,
    discount: 25,
    fabric: 'Organza Silk',
    sareeType: 'Designer',
    color: 'Midnight Blue',
    colors: ['Blue'],
    stock: 10,
    relPath: 'bridal-saree/VT-1875-blue',
    occasion: ['Reception', 'Party', 'Cocktail'],
    isFeatured: true,
    isBestseller: false,
  },
  {
    sku: 'VT-1875-PURPLE',
    name: 'Handwork Heavy Bridal Saree - Regal Purple (VT-1875-PUR)',
    description: 'Regal purple handwork saree with dense floral border embroidery and lightweight drape. Elegant luxury redefined.',
    category: CATEGORIES.bridal,
    price: 1875,
    compareAtPrice: 2500,
    discount: 25,
    fabric: 'Organza Silk',
    sareeType: 'Designer',
    color: 'Regal Purple',
    colors: ['Purple'],
    stock: 10,
    relPath: 'bridal-saree/VT-1875-purple',
    occasion: ['Reception', 'Festive', 'Wedding'],
    isFeatured: true,
    isBestseller: true,
  },
  {
    sku: 'VT-11029-V2',
    name: 'Petrol Blue Gold Floral Silk Saree - Edition 2 (VT-11029-V2)',
    description: 'A refreshed edition of our bestselling petrol blue silk saree with floral zari weave and matching blouse piece.',
    category: CATEGORIES.silk,
    price: 1500,
    compareAtPrice: 2500,
    discount: 40,
    fabric: 'Silk Blend',
    sareeType: 'Banarasi',
    color: 'Petrol Blue',
    colors: ['Blue'],
    stock: 15,
    relPath: 'silk-saree/VT-11029-v2',
    occasion: ['Festive', 'Puja', 'Wedding'],
    isFeatured: false,
    isBestseller: true,
  },
  {
    sku: 'VT-1799',
    name: 'Designer Handwoven Silk Saree (VT-1799)',
    description: 'Authentic handwoven silk saree with traditional borders and lustrous finish. Built for heritage celebrations and pujas.',
    category: CATEGORIES.silk,
    price: 1799,
    compareAtPrice: 2400,
    discount: 25,
    fabric: 'Kanjivaram Silk',
    sareeType: 'Kanjivaram',
    color: 'Gold & Maroon',
    colors: ['Gold', 'Maroon'],
    stock: 12,
    relPath: 'silk-saree/VT-1799',
    occasion: ['Traditional', 'Puja', 'Wedding'],
    isFeatured: true,
    isBestseller: true,
  },
  {
    sku: 'VT-11285-PCK',
    name: 'Peacock Blue Zari Border Silk Saree (VT-11285-PCK)',
    description: 'Vibrant peacock blue silk saree highlighted by an ornate antique zari border and pallu. Graceful and lightweight.',
    category: CATEGORIES.silk,
    price: 1650,
    compareAtPrice: 2200,
    discount: 25,
    fabric: 'Chanderi Silk',
    sareeType: 'Chanderi',
    color: 'Peacock Blue',
    colors: ['Blue'],
    stock: 14,
    relPath: 'silk-saree/VT-11285-peacock',
    occasion: ['Festive', 'Daytime Wedding'],
    isFeatured: false,
    isBestseller: false,
  },
  {
    sku: 'VT-11285-TEL',
    name: 'Teal Blue Zari Weave Silk Saree (VT-11285-TEL)',
    description: 'Stunning teal blue silk saree with all-over delicate weave and contrasting rich pallu detail.',
    category: CATEGORIES.silk,
    price: 1650,
    compareAtPrice: 2200,
    discount: 25,
    fabric: 'Chanderi Silk',
    sareeType: 'Chanderi',
    color: 'Teal Blue',
    colors: ['Teal', 'Blue'],
    stock: 14,
    relPath: 'silk-saree/VT-11285-teal',
    occasion: ['Festive', 'Puja', 'Reception'],
    isFeatured: true,
    isBestseller: false,
  },
  {
    sku: 'VT-11299-MLI',
    name: 'Malai Silk Soft Handloom Saree (VT-11299-MLI)',
    description: 'Ultra-soft malai silk fabric that drapes effortlessly with a subtle sheen and lightweight festive elegance.',
    category: CATEGORIES.silk,
    price: 1599,
    compareAtPrice: 2199,
    discount: 27,
    fabric: 'Malai Silk',
    sareeType: 'Silk',
    color: 'Cream & Gold',
    colors: ['Cream', 'Gold'],
    stock: 15,
    relPath: 'silk-saree/VT-11299-malai',
    occasion: ['Puja', 'Festive', 'Daytime Function'],
    isFeatured: true,
    isBestseller: true,
  },
  {
    sku: 'VT-1775-GRN',
    name: 'Emerald Green Festive Silk Saree (VT-1775-GRN)',
    description: 'Rich emerald green festive saree embellished with authentic Banarasi floral buttis and temple zari border.',
    category: CATEGORIES.silk,
    price: 1775,
    compareAtPrice: 2350,
    discount: 24,
    fabric: 'Banarasi Silk',
    sareeType: 'Banarasi',
    color: 'Emerald Green',
    colors: ['Green'],
    stock: 12,
    relPath: 'silk-saree/VT-1775-green',
    occasion: ['Festive', 'Wedding Guest', 'Puja'],
    isFeatured: true,
    isBestseller: false,
  },
  {
    sku: 'VT-1499-V2',
    name: 'Shimmer Embroidered Partywear Saree - Style 2 (VT-1499-V2)',
    description: 'Fluid shimmer georgette party saree with light-catching stone and sequin embroidery along the border.',
    category: CATEGORIES.partywear,
    price: 1499,
    compareAtPrice: 2100,
    discount: 29,
    fabric: 'Shimmer Georgette',
    sareeType: 'Designer',
    color: 'Rose Gold',
    colors: ['Pink', 'Gold'],
    stock: 14,
    relPath: 'partywear/VT-1499-v2',
    occasion: ['Party', 'Reception', 'Cocktail'],
    isFeatured: false,
    isBestseller: false,
  },
  {
    sku: 'VT-11599-PNK',
    name: 'Blush Pink Shimmer Partywear Saree (VT-11599-PNK)',
    description: 'Delicate blush pink tissue shimmer saree designed for receptions, evening cocktails, and contemporary celebrations.',
    category: CATEGORIES.partywear,
    price: 1599,
    compareAtPrice: 2200,
    discount: 27,
    fabric: 'Shimmer Tissue',
    sareeType: 'Partywear',
    color: 'Blush Pink',
    colors: ['Pink'],
    stock: 12,
    relPath: 'partywear/VT-11599-blush-pink',
    occasion: ['Party', 'Cocktail', 'Farewell'],
    isFeatured: true,
    isBestseller: false,
  },
  {
    sku: 'VT-1660',
    name: 'Classic Embroidered Georgette Saree (VT-1660)',
    description: 'Timeless georgette saree featuring intricate tonal thread embroidery and scalloped border finish.',
    category: CATEGORIES.saree,
    price: 1660,
    compareAtPrice: 2200,
    discount: 25,
    fabric: 'Georgette',
    sareeType: 'Georgette',
    color: 'Wine Red',
    colors: ['Red', 'Wine'],
    stock: 15,
    relPath: 'georgette-saree/VT-1660',
    occasion: ['Festive', 'Party', 'Evening'],
    isFeatured: false,
    isBestseller: false,
  },
  {
    sku: 'VT-1660-BRN',
    name: 'Light Brown Embroidered Georgette Saree (VT-1660-BRN)',
    description: 'Subtle light brown georgette saree with intricate scalloped zari border and delicate floral motifs.',
    category: CATEGORIES.saree,
    price: 1660,
    compareAtPrice: 2200,
    discount: 25,
    fabric: 'Georgette',
    sareeType: 'Georgette',
    color: 'Light Brown',
    colors: ['Brown', 'Beige'],
    stock: 15,
    relPath: 'georgette-saree/VT-1660-light-brown',
    occasion: ['Festive', 'Daytime Function'],
    isFeatured: false,
    isBestseller: false,
  },
  {
    sku: 'VT-1660-DIG',
    name: 'Digital Floral Print Georgette Saree (VT-1660-DIG)',
    description: 'Contemporary digital floral print saree on featherlight georgette fabric with a fine zari border.',
    category: CATEGORIES.saree,
    price: 1660,
    compareAtPrice: 2200,
    discount: 25,
    fabric: 'Georgette',
    sareeType: 'Georgette',
    color: 'Multicolour Floral',
    colors: ['Multicolor'],
    stock: 15,
    relPath: 'georgette-saree/VT-1660-digital-print',
    occasion: ['Casual Festive', 'Daytime Function'],
    isFeatured: false,
    isBestseller: false,
  },
  {
    sku: 'VT-11285-IVR',
    name: 'Digital Print Ivory Georgette Saree (VT-11285-IVR)',
    description: 'Elegant ivory georgette saree covered with soft watercolour digital prints and finished with an embroidered border.',
    category: CATEGORIES.saree,
    price: 1550,
    compareAtPrice: 2100,
    discount: 26,
    fabric: 'Georgette',
    sareeType: 'Georgette',
    color: 'Ivory',
    colors: ['White', 'Beige'],
    stock: 15,
    relPath: 'georgette-saree/VT-11285-ivory',
    occasion: ['Daytime Function', 'Festive'],
    isFeatured: false,
    isBestseller: false,
  },
];

async function main() {
  console.log('1. Logging in as admin...');
  const lr = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const lj = await lr.json();
  if (!lr.ok) {
    console.error('Login failed:', lr.status, lj);
    process.exit(1);
  }
  const token = lj.data.accessToken;
  console.log(`Logged in successfully as ${lj.data.user.email} (${lj.data.user.role})`);

  console.log('\n2. Fetching existing sarees...');
  const sr = await fetch(`${API}/sarees?limit=100`);
  const sj = await sr.json();
  const existingItems = sj?.data?.items || [];
  const existingSkus = new Set(existingItems.map((p) => p.sku.toUpperCase()));
  console.log(`Found ${existingItems.length} existing sarees in database.`);

  let created = 0, skipped = 0, failed = 0;

  for (const item of NEW_PRODUCTS) {
    if (existingSkus.has(item.sku.toUpperCase())) {
      console.log(`⏭️  Skip ${item.sku} — already exists in DB`);
      skipped++;
      continue;
    }

    const imgDir = path.resolve('frontend/public/product-images/categories', item.relPath);
    let images = [];
    if (fs.existsSync(imgDir)) {
      images = fs
        .readdirSync(imgDir)
        .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f) && !/ref/i.test(f))
        .sort()
        .map((f) => `/product-images/categories/${item.relPath}/${f}`);
    }

    if (images.length === 0) {
      console.warn(`⚠️  No images found for ${item.sku} in ${imgDir}`);
      failed++;
      continue;
    }

    const payload = {
      name: item.name,
      description: item.description,
      category: item.category,
      images,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      discount: item.discount,
      sku: item.sku,
      stock: item.stock,
      fabric: item.fabric,
      sareeType: item.sareeType,
      color: item.color,
      colors: item.colors,
      blousePiece: true,
      blouseLength: 0.8,
      sareeLength: 5.5,
      occasion: item.occasion,
      isFeatured: item.isFeatured,
      isBestseller: item.isBestseller,
      isActive: true, // Directly ACTIVE so it appears on website and admin!
    };

    const cr = await fetch(`${API}/sarees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const cj = await cr.json();
    if (cr.ok && cj.success) {
      console.log(`✅ Created: ${item.sku} — "${item.name}" (Price: ₹${item.price}, Stock: ${item.stock}, Images: ${images.length})`);
      created++;
    } else {
      console.error(`❌ Failed: ${item.sku} (${cr.status})`, cj);
      failed++;
    }
  }

  console.log(`\nImport Summary:`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
