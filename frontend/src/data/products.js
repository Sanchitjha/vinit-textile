export const categories = [
  { slug: 'saree', name: 'Saree', tone: 'maroon' },
  { slug: 'kurti', name: 'Kurti', tone: 'mauve' },
  { slug: 'dress', name: 'Dress', tone: 'gold' },
  { slug: 'lehenga', name: 'Lehenga', tone: 'teal' },
]

// Sub-facets shown in the "Sarees — Timeless Elegance, Just For You" strip
// right under the hero. All route to the saree listing for now since there's
// no occasion-tag filtering on the backend yet — swap `to` for a filtered
// URL (e.g. /shop/saree?occasion=bridal) once that exists.
export const sareeOccasions = [
  { slug: 'bestsellers', name: 'Bestsellers / New Arrivals', to: '/shop/saree', tone: 'vermillion' },
  { slug: 'partywear', name: 'Partywear Collection', to: '/shop/saree', tone: 'maroon' },
  { slug: 'wedding', name: 'Wedding Edit', to: '/shop/saree', tone: 'gold' },
  { slug: 'office', name: 'Everyday Elegance / Office Wear', to: '/shop/saree', tone: 'mauve' },
  { slug: 'pooja', name: 'Pooja & Traditional', to: '/shop/saree', tone: 'brown' },
  { slug: 'bridal', name: 'Bridal Edit', to: '/shop/saree', tone: 'teal' },
]

export const occasions = [
  { slug: 'wedding', name: 'Wedding Edit', to: '/shop/saree', image: '/images/occasion-wedding.webp' },
  { slug: 'diwali', name: 'Diwali Collection', to: '/shop/lehenga', image: '/images/occasion-diwali.webp' },
  { slug: 'bridal', name: 'Bridal Trousseau', to: '/shop/lehenga', image: '/images/occasion-bridal.webp' },
  { slug: 'festive', name: 'Festive Everyday', to: '/shop/kurti', image: '/images/occasion-festive-everyday.webp' },
]

const FALLBACK_TONES = ['brown', 'mauve', 'gold', 'teal', 'cream', 'ivory']

// The first two entries are shot with Vinit Textiles' own product photography
// (see Placeholder — swap those two slots for the real files first).
export const products = [
  {
    id: 'VT-12590',
    sku: 'VT-12590',
    name: 'Royal Zari Woven Silk Saree (VT-12590)',
    category: 'silk-saree',
    price: 2590,
    mrp: 3200,
    ratings: 4.9,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-12590/01.png',
      '/images/products/VT-12590/02.png',
      '/images/products/VT-12590/03.png',
      '/images/products/VT-12590/04.png',
    ],
  },
  {
    id: 'VT-1395',
    sku: 'VT-1395',
    name: 'Traditional Banarasi Silk Saree (VT-1395)',
    category: 'silk-saree',
    price: 1395,
    mrp: 1800,
    ratings: 4.8,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-1395/01.jpg',
      '/images/products/VT-1395/02.jpg',
      '/images/products/VT-1395/03.jpg',
      '/images/products/VT-1395/04.jpg',
      '/images/products/VT-1395/05.jpg',
    ],
  },
  {
    id: 'VT-1425',
    sku: 'VT-1425',
    name: 'Festive Organza Zari Drape Saree (VT-1425)',
    category: 'partywear',
    price: 1425,
    mrp: 1900,
    ratings: 4.7,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-1425/01.jpg',
      '/images/products/VT-1425/02.jpg',
      '/images/products/VT-1425/03.png',
      '/images/products/VT-1425/04.jpg',
      '/images/products/VT-1425/05.jpg',
    ],
  },
  {
    id: 'VT-1460',
    sku: 'VT-1460',
    name: 'Handloom Cotton Silk Floral Saree (VT-1460)',
    category: 'cotton-saree',
    price: 1460,
    mrp: 1950,
    ratings: 4.8,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-1460/01.png',
      '/images/products/VT-1460/02.png',
      '/images/products/VT-1460/03.png',
      '/images/products/VT-1460/04.png',
      '/images/products/VT-1460/05.png',
    ],
  },
  {
    id: 'VT-1470',
    sku: 'VT-1470',
    name: 'Georgette Micro-Sequin Border Saree (VT-1470)',
    category: 'partywear',
    price: 1470,
    mrp: 1990,
    ratings: 4.9,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-1470/01.png',
      '/images/products/VT-1470/02.png',
      '/images/products/VT-1470/03.png',
      '/images/products/VT-1470/04.png',
      '/images/products/VT-1470/05.png',
    ],
  },
  {
    id: 'VT-1499',
    sku: 'VT-1499',
    name: 'Designer Partywear Embroidered Saree (VT-1499)',
    category: 'partywear',
    price: 1499,
    mrp: 2100,
    ratings: 4.8,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-1499/01.png',
      '/images/products/VT-1499/04.png',
      '/images/products/VT-1499/05.png',
    ],
  },
  {
    id: 'VT-1565',
    sku: 'VT-1565',
    name: 'Pure Kanjivaram Style Brocade Silk Saree (VT-1565)',
    category: 'silk-saree',
    price: 1565,
    mrp: 2200,
    ratings: 5.0,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-1565/01.png',
      '/images/products/VT-1565/02.png',
      '/images/products/VT-1565/03.png',
      '/images/products/VT-1565/04.png',
      '/images/products/VT-1565/05.png',
    ],
  },
  {
    id: 'VT-1599',
    sku: 'VT-1599',
    name: 'Festive Chanderi Silk Zari Saree (VT-1599)',
    category: 'silk-saree',
    price: 1599,
    mrp: 2250,
    ratings: 4.9,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-1599/01.png',
      '/images/products/VT-1599/02.png',
      '/images/products/VT-1599/03.png',
      '/images/products/VT-1599/04.png',
      '/images/products/VT-1599/05.png',
    ],
  },
  {
    id: 'VT-1699',
    sku: 'VT-1699',
    name: 'Royal Velvet Border Handwoven Saree (VT-1699)',
    category: 'bridal-saree',
    price: 1699,
    mrp: 2400,
    ratings: 5.0,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-1699/01.jpg',
      '/images/products/VT-1699/02.jpg',
      '/images/products/VT-1699/03.png',
      '/images/products/VT-1699/04.jpg',
      '/images/products/VT-1699/05.jpg',
    ],
  },
  {
    id: 'VT-1855',
    sku: 'VT-1855',
    name: 'Premium Bridal Trousseau Velvet Saree (VT-1855)',
    category: 'bridal-saree',
    price: 1855,
    mrp: 2600,
    ratings: 5.0,
    isFeatured: true,
    isBestseller: true,
    images: [
      '/images/products/VT-1855/02.png',
      '/images/products/VT-1855/03.png',
      '/images/products/VT-1855/04.png',
      '/images/products/VT-1855/05.png',
    ],
  },
]

export function getProductsByCategory(slug) {
  return products.filter((product) => product.category === slug)
}

export function getProductById(id) {
  return products.find((product) => product.id === id)
}

export function toneFor(id) {
  const product = products.find((p) => p.id === id)
  if (product?.tone) return product.tone
  const index = products.findIndex((p) => p.id === id)
  return FALLBACK_TONES[index % FALLBACK_TONES.length]
}
