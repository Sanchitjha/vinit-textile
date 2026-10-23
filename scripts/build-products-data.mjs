import fs from 'fs';

const root = 'frontend/public/product-images/categories';

const metadata = {
  // Silk (9)
  'VT-11029': {
    name: 'Petrol Blue Gold Floral Embroidered Saree (VT-11029)',
    sku: 'VT-11029',
    category: 'silk-saree', price: 1500, mrp: 2500, fabric: 'Silk Blend', color: 'Petrol Blue', colors: ['Blue'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'silk-saree/VT-11029'
  },
  'VT-12590': {
    name: 'Royal Zari Woven Silk Saree (VT-12590)',
    sku: 'VT-12590',
    category: 'silk-saree', price: 2590, mrp: 3200, fabric: 'Silk', color: 'Red & Gold', colors: ['Red', 'Gold'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'silk-saree/VT-12590'
  },
  'VT-12590-v2': {
    name: 'Royal Zari Woven Silk Saree - Ruby Red Edition (VT-12590-V2)',
    sku: 'VT-12590-V2',
    category: 'silk-saree', price: 2590, mrp: 3200, fabric: 'Georgette', color: 'Ivory & Multicolour', colors: ['Beige', 'Multicolor'],
    ratings: 4.9, isFeatured: true, isBestseller: false, folder: 'silk-saree/VT-12590-v2'
  },
  'VT-1395': {
    name: 'Traditional Banarasi Silk Saree - Maroon (VT-1395)',
    sku: 'VT-1395',
    category: 'silk-saree', price: 1395, mrp: 1800, fabric: 'Banarasi Silk', color: 'Maroon', colors: ['Maroon'],
    ratings: 4.8, isFeatured: true, isBestseller: true, folder: 'silk-saree/VT-1395'
  },
  'VT-1395-purple': {
    name: 'Traditional Banarasi Silk Saree - Purple Orchid (VT-1395-PUR)',
    sku: 'VT-1395-PUR',
    category: 'silk-saree', price: 1395, mrp: 1800, fabric: 'Georgette', color: 'Lavender', colors: ['Purple'],
    ratings: 4.9, isFeatured: true, isBestseller: false, folder: 'silk-saree/VT-1395-purple'
  },
  'VT-1565': {
    name: 'Pure Kanjivaram Style Brocade Silk Saree (VT-1565)',
    sku: 'VT-1565',
    category: 'silk-saree', price: 1565, mrp: 2200, fabric: 'Kanjivaram Silk', color: 'Purple & Gold', colors: ['Purple', 'Gold'],
    ratings: 5.0, isFeatured: true, isBestseller: true, folder: 'silk-saree/VT-1565'
  },
  'VT-1565-v2': {
    name: 'Pure Kanjivaram Brocade Silk Saree - Temple Motif Edition (VT-1565-V2)',
    sku: 'VT-1565-V2',
    category: 'silk-saree', price: 1565, mrp: 2200, fabric: 'Georgette', color: 'Burnt Orange', colors: ['Orange'],
    ratings: 5.0, isFeatured: true, isBestseller: false, folder: 'silk-saree/VT-1565-v2'
  },
  'VT-1599': {
    name: 'Festive Chanderi Silk Zari Saree (VT-1599)',
    sku: 'VT-1599',
    category: 'silk-saree', price: 1599, mrp: 2250, fabric: 'Chanderi Silk', color: 'Royal Blue', colors: ['Blue'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'silk-saree/VT-1599'
  },
  'VT-1599-v2': {
    name: 'Festive Chanderi Silk Zari Saree - Peacock Weave (VT-1599-V2)',
    sku: 'VT-1599-V2',
    category: 'silk-saree', price: 1599, mrp: 2250, fabric: 'Silk Blend', color: 'Royal Blue', colors: ['Blue'],
    ratings: 4.9, isFeatured: true, isBestseller: false, folder: 'silk-saree/VT-1599-v2'
  },

  // Organza (2)
  'VT-1425': {
    name: 'Festive Organza Zari Drape Saree (VT-1425)',
    sku: 'VT-1425',
    category: 'organza-saree', price: 1425, mrp: 1900, fabric: 'Organza', color: 'Blush Pink', colors: ['Pink'],
    ratings: 4.7, isFeatured: true, isBestseller: true, folder: 'organza-saree/VT-1425'
  },
  'VT-1425-v2': {
    name: 'Festive Organza Zari Drape Saree - Rose Gold Edition (VT-1425-V2)',
    sku: 'VT-1425-V2',
    category: 'organza-saree', price: 1425, mrp: 1900, fabric: 'Shimmer Georgette', color: 'Mustard Green', colors: ['Green', 'Yellow'],
    ratings: 4.8, isFeatured: true, isBestseller: false, folder: 'organza-saree/VT-1425-v2'
  },

  // Cotton (2)
  'VT-1460': {
    name: 'Handloom Cotton Silk Floral Saree (VT-1460)',
    sku: 'VT-1460',
    category: 'cotton-saree', price: 1460, mrp: 1950, fabric: 'Cotton Silk', color: 'Yellow', colors: ['Yellow'],
    ratings: 4.8, isFeatured: true, isBestseller: true, folder: 'cotton-saree/VT-1460'
  },
  'VT-1460-v2': {
    name: 'Handloom Cotton Silk Floral Saree - Mustard Gold (VT-1460-V2)',
    sku: 'VT-1460-V2',
    category: 'cotton-saree', price: 1460, mrp: 1950, fabric: 'Georgette', color: 'Crimson Red', colors: ['Red'],
    ratings: 4.8, isFeatured: true, isBestseller: false, folder: 'cotton-saree/VT-1460-v2'
  },

  // Georgette (4)
  'VT-12599': {
    name: 'Mint Green Paisley Embroidered Saree (VT-12599)',
    sku: 'VT-12599',
    category: 'georgette-saree', price: 3000, mrp: 4500, fabric: 'Georgette', color: 'Mint Green', colors: ['Green'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'georgette-saree/VT-12599'
  },
  'VT-1470': {
    name: 'Georgette Micro-Sequin Border Saree (VT-1470)',
    sku: 'VT-1470',
    category: 'georgette-saree', price: 1470, mrp: 1990, fabric: 'Georgette', color: 'Emerald Green', colors: ['Green'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'georgette-saree/VT-1470'
  },
  'VT-1470-v2': {
    name: 'Georgette Micro-Sequin Border Saree - Jade Emerald (VT-1470-V2)',
    sku: 'VT-1470-V2',
    category: 'georgette-saree', price: 1470, mrp: 1990, fabric: 'Georgette', color: 'Red', colors: ['Red'],
    ratings: 4.9, isFeatured: true, isBestseller: false, folder: 'georgette-saree/VT-1470-v2'
  },
  'VTLR-1499': {
    name: 'Grey Printed Saree with Folk Art Border (VTLR-1499)',
    sku: 'VTLR-1499',
    category: 'georgette-saree', price: 1499, mrp: 2100, fabric: 'Georgette', color: 'Grey', colors: ['Grey'],
    ratings: 4.8, isFeatured: true, isBestseller: true, folder: 'georgette-saree/VTLR-1499'
  },

  // Partywear (15)
  'VT-1499': {
    name: 'Designer Partywear Embroidered Saree - Dusty Rose (VT-1499)',
    sku: 'VT-1499',
    category: 'partywear', price: 1499, mrp: 2100, fabric: 'Silk Blend', color: 'Teal Blue', colors: ['Teal'],
    ratings: 4.8, isFeatured: true, isBestseller: true, folder: 'partywear/VT-1499'
  },
  'VT-1499-yellow': {
    name: 'Designer Partywear Embroidered Saree - Sunshine Yellow (VT-1499-YEL)',
    sku: 'VT-1499-YEL',
    category: 'partywear', price: 1499, mrp: 2100, fabric: 'Shimmer Georgette', color: 'Olive Green', colors: ['Green'],
    ratings: 4.9, isFeatured: true, isBestseller: false, folder: 'partywear/VT-1499-yellow'
  },
  'VT-1499-blue': {
    name: 'Designer Partywear Embroidered Saree - Ocean Blue (VT-1499-BLU)',
    sku: 'VT-1499-BLU',
    category: 'partywear', price: 1499, mrp: 2100, fabric: 'Shimmer Georgette', color: 'Rose Brown', colors: ['Brown'],
    ratings: 4.8, isFeatured: true, isBestseller: false, folder: 'partywear/VT-1499-blue'
  },
  'VT-1499-green': {
    name: 'Designer Partywear Embroidered Saree - Emerald Green (VT-1499-GRN)',
    sku: 'VT-1499-GRN',
    category: 'partywear', price: 1499, mrp: 2100, fabric: 'Shimmer Georgette', color: 'Powder Blue', colors: ['Blue'],
    ratings: 4.9, isFeatured: true, isBestseller: false, folder: 'partywear/VT-1499-green'
  },
  'VT-1499-purple': {
    name: 'Designer Partywear Embroidered Saree - Royal Purple (VT-1499-PUR)',
    sku: 'VT-1499-PUR',
    category: 'partywear', price: 1499, mrp: 2100, fabric: 'Shimmer Georgette', color: 'Sunshine Yellow', colors: ['Yellow'],
    ratings: 4.9, isFeatured: true, isBestseller: false, folder: 'partywear/VT-1499-purple'
  },
  'VT-1525-blue': {
    name: 'Sky Blue Bead & Sequin Stripe Net Saree (VT-1525-BLUE)',
    sku: 'VT-1525-BLUE',
    category: 'partywear', price: 1199, mrp: 2100, fabric: 'Net', color: 'Sky Blue', colors: ['Blue'],
    ratings: 4.8, isFeatured: true, isBestseller: true, folder: 'partywear/VT-1525-blue'
  },
  'VT-1525-green': {
    name: 'Sage Green Bead & Sequin Stripe Net Saree (VT-1525-GREEN)',
    sku: 'VT-1525-GREEN',
    category: 'partywear', price: 1199, mrp: 2100, fabric: 'Net', color: 'Sage Green', colors: ['Green'],
    ratings: 4.8, isFeatured: true, isBestseller: true, folder: 'partywear/VT-1525-green'
  },
  'VT-1525-pink': {
    name: 'Lilac Pink Bead & Sequin Stripe Net Saree (VT-1525-PINK)',
    sku: 'VT-1525-PINK',
    category: 'partywear', price: 1199, mrp: 2100, fabric: 'Net', color: 'Lilac Pink', colors: ['Pink', 'Purple'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'partywear/VT-1525-pink'
  },
  'VT-1625': {
    name: 'Steel Blue Beaded Net Saree with Scalloped Border (VT-1625)',
    sku: 'VT-1625',
    category: 'partywear', price: 1399, mrp: 2300, fabric: 'Net', color: 'Steel Blue', colors: ['Blue', 'Grey'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'partywear/VT-1625'
  },
  'VT-1625-green': {
    name: 'Sage Green Beaded Net Saree with Scalloped Border (VT-1625-GREEN)',
    sku: 'VT-1625-GREEN',
    category: 'partywear', price: 1399, mrp: 2300, fabric: 'Net', color: 'Sage Green', colors: ['Green'],
    ratings: 4.9, isFeatured: true, isBestseller: false, folder: 'partywear/VT-1625-green'
  },
  'VT-1625-orange': {
    name: 'Rust Orange Beaded Net Saree with Scalloped Border (VT-1625-ORANGE)',
    sku: 'VT-1625-ORANGE',
    category: 'partywear', price: 1399, mrp: 2300, fabric: 'Net', color: 'Rust Orange', colors: ['Orange', 'Brown'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'partywear/VT-1625-orange'
  },
  'VT-1625-pink': {
    name: 'Orchid Pink Beaded Net Saree with Scalloped Border (VT-1625-PINK)',
    sku: 'VT-1625-PINK',
    category: 'partywear', price: 1399, mrp: 2300, fabric: 'Net', color: 'Orchid Pink', colors: ['Pink'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'partywear/VT-1625-pink'
  },
  'VT-1625-purple': {
    name: 'Dusty Lavender Beaded Net Saree with Scalloped Border (VT-1625-PURPLE)',
    sku: 'VT-1625-PURPLE',
    category: 'partywear', price: 1399, mrp: 2300, fabric: 'Net', color: 'Dusty Lavender', colors: ['Purple'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'partywear/VT-1625-purple'
  },
  'VT-1625-yellow': {
    name: 'Mustard Yellow Beaded Net Saree with Scalloped Border (VT-1625-YELLOW)',
    sku: 'VT-1625-YELLOW',
    category: 'partywear', price: 1399, mrp: 2300, fabric: 'Net', color: 'Mustard Yellow', colors: ['Yellow'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'partywear/VT-1625-yellow'
  },
  'VT-2860': {
    name: 'Plum Purple Designer Partywear Saree (VT-2860)',
    sku: 'VT-2860',
    category: 'partywear', price: 1999, mrp: 2600, fabric: 'Georgette', color: 'Plum Purple', colors: ['Purple'],
    ratings: 4.9, isFeatured: true, isBestseller: true, folder: 'partywear/VT-2860'
  },

  // Bridal (6)
  'VT-1699': {
    name: 'Ivory Pink Floral Georgette Saree (VT-1699)',
    sku: 'VT-1699',
    category: 'bridal-saree', price: 1299, mrp: 2400, fabric: 'Georgette', color: 'Ivory & Pink', colors: ['White', 'Pink'],
    ratings: 5.0, isFeatured: true, isBestseller: true, folder: 'bridal-saree/VT-1699'
  },
  'VT-1699-flowers': {
    name: 'Royal Velvet Floral Weave Saree (VT-1699-FLW)',
    sku: 'VT-1699-FLW',
    category: 'bridal-saree', price: 1699, mrp: 2400, fabric: 'Silk Velvet', color: 'Deep Red', colors: ['Red'],
    ratings: 5.0, isFeatured: true, isBestseller: false, folder: 'bridal-saree/VT-1699-flowers'
  },
  'VT-1699-brown': {
    name: 'Royal Velvet Border Silk Saree - Cocoa Brown (VT-1699-BRN)',
    sku: 'VT-1699-BRN',
    category: 'bridal-saree', price: 1699, mrp: 2400, fabric: 'Silk Velvet', color: 'Cocoa Brown', colors: ['Brown'],
    ratings: 5.0, isFeatured: true, isBestseller: false, folder: 'bridal-saree/VT-1699-brown'
  },
  'VT-1699-elephant': {
    name: 'Royal Velvet Heritage Elephant Motif Saree (VT-1699-ELP)',
    sku: 'VT-1699-ELP',
    category: 'bridal-saree', price: 1699, mrp: 2400, fabric: 'Silk Velvet', color: 'Maroon', colors: ['Maroon'],
    ratings: 5.0, isFeatured: true, isBestseller: false, folder: 'bridal-saree/VT-1699-elephant'
  },
  'VT-1855': {
    name: 'Premium Bridal Trousseau Velvet Saree (VT-1855)',
    sku: 'VT-1855',
    category: 'bridal-saree', price: 1855, mrp: 2600, fabric: 'Velvet Silk', color: 'Crimson Maroon', colors: ['Maroon'],
    ratings: 5.0, isFeatured: true, isBestseller: true, folder: 'bridal-saree/VT-1855'
  },
  'VT-1855-v2': {
    name: 'Mustard Yellow Floral Embroidered Saree - Design 2 (VT-1855-V2)',
    sku: 'VT-1855-V2',
    category: 'bridal-saree', price: 1799, mrp: 2600, fabric: 'Silk Blend', color: 'Mustard Yellow', colors: ['Yellow'],
    ratings: 5.0, isFeatured: true, isBestseller: false, folder: 'bridal-saree/VT-1855-v2'
  }
};

const productList = Object.entries(metadata).map(([id, p]) => {
  const dir = root + '/' + p.folder;
  const files = fs.readdirSync(dir).filter(f => /\.webp$/i.test(f)).sort();
  const images = files.map(f => '/product-images/categories/' + p.folder + '/' + f);
  return {
    id,
    sku: p.sku || id.toUpperCase(),
    name: p.name,
    category: p.category,
    price: p.price,
    mrp: p.mrp,
    fabric: p.fabric,
    color: p.color,
    colors: p.colors || [p.color],
    ratings: p.ratings || 4.8,
    isFeatured: p.isFeatured ?? true,
    isBestseller: p.isBestseller ?? false,
    images
  };
});

const content = `export const categories = [
  { slug: 'saree', name: 'All Sarees', tone: 'maroon' },
  { slug: 'silk-saree', name: 'Silk Sarees', tone: 'gold' },
  { slug: 'organza-saree', name: 'Organza Sarees', tone: 'mauve' },
  { slug: 'cotton-saree', name: 'Cotton Sarees', tone: 'brown' },
  { slug: 'georgette-saree', name: 'Georgette Sarees', tone: 'teal' },
  { slug: 'partywear', name: 'Partywear Sarees', tone: 'vermillion' },
  { slug: 'bridal-saree', name: 'Bridal Sarees', tone: 'maroon' },
]

export const sareeOccasions = [
  { slug: 'bestsellers', name: 'Bestsellers / New Arrivals', to: '/shop/saree', tone: 'vermillion' },
  { slug: 'partywear', name: 'Partywear Collection', to: '/shop/saree', tone: 'maroon' },
  { slug: 'wedding', name: 'Wedding Edit', to: '/shop/saree', tone: 'gold' },
  { slug: 'silk-saree', name: 'Royal Silk Edit', to: '/shop/saree', tone: 'gold' },
  { slug: 'organza-saree', name: 'Organza Drape', to: '/shop/saree', tone: 'mauve' },
  { slug: 'bridal', name: 'Bridal Edit', to: '/shop/saree', tone: 'teal' },
]

export const occasions = [
  { slug: 'wedding', name: 'Wedding Edit', to: '/shop/saree', image: '/product-images/categories/bridal-saree/VT-1699/01.webp' },
  { slug: 'diwali', name: 'Diwali Collection', to: '/shop/saree', image: '/product-images/categories/partywear/VT-1499/01.webp' },
  { slug: 'bridal', name: 'Bridal Trousseau', to: '/shop/saree', image: '/product-images/categories/bridal-saree/VT-1855/01.webp' },
  { slug: 'festive', name: 'Festive Everyday', to: '/shop/saree', image: '/product-images/categories/silk-saree/VT-12590/01.webp' },
]

const FALLBACK_TONES = ['brown', 'mauve', 'gold', 'teal', 'cream', 'ivory']

export const products = ${JSON.stringify(productList, null, 2)}

export function getProductsByCategory(slug) {
  if (!slug || slug === 'saree' || slug === 'all') return products
  return products.filter((product) => product.category === slug)
}

export function getProductById(id) {
  if (!id) return undefined
  const target = String(id).toLowerCase()
  return products.find((product) => 
    product.id?.toLowerCase() === target || 
    product.sku?.toLowerCase() === target || 
    (product._id && String(product._id) === target)
  )
}

export function toneFor(id) {
  const product = products.find((p) => p.id === id || p.sku === id)
  if (product?.tone) return product.tone
  const index = products.findIndex((p) => p.id === id || p.sku === id)
  return FALLBACK_TONES[index >= 0 ? index % FALLBACK_TONES.length : 0]
}
`;

fs.writeFileSync('frontend/src/data/products.js', content, 'utf8');
console.log('Successfully wrote frontend/src/data/products.js with', productList.length, 'products!');
