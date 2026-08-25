export const categories = [
  { slug: 'saree', name: 'Saree', tone: 'brown' },
  { slug: 'kurti', name: 'Kurti', tone: 'mauve' },
  { slug: 'dress', name: 'Dress', tone: 'olive' },
  { slug: 'lehenga', name: 'Lehenga', tone: 'cream' },
]

const TONES = ['brown', 'mauve', 'olive', 'cream', 'ivory']

export const products = [
  { id: 'amb-saree-silk-magenta', name: 'Anti-silk Banarasi Saree with Zari Weave', category: 'saree', price: 2800, mrp: 3500 },
  { id: 'amb-saree-linen-emerald', name: 'Linen Georgette Saree with Sequin Border', category: 'saree', price: 2895, mrp: 3600 },
  { id: 'amb-saree-mulberry-gold', name: 'Mulberry Silk Saree with Golden Tissue', category: 'saree', price: 3195, mrp: 3900 },
  { id: 'amb-saree-cotton-yellow', name: 'Handloom Cotton Saree with Ikat Print', category: 'saree', price: 2299, mrp: 2800 },
  { id: 'amb-lehenga-bridal-red', name: 'Bridal Velvet Lehenga with Zardozi Work', category: 'lehenga', price: 8990, mrp: 11500 },
  { id: 'amb-lehenga-net-blush', name: 'Soft Net Lehenga with Mirror Embroidery', category: 'lehenga', price: 6490, mrp: 7900 },
  { id: 'amb-lehenga-festive-teal', name: 'Festive Silk Lehenga with Thread Work', category: 'lehenga', price: 5990, mrp: 7200 },
  { id: 'amb-lehenga-classic-maroon', name: 'Classic Raw Silk Lehenga Choli', category: 'lehenga', price: 7290, mrp: 8600 },
  { id: 'amb-kurti-straight-mustard', name: 'Straight-cut Cotton Kurti', category: 'kurti', price: 1199, mrp: 1500 },
  { id: 'amb-kurti-anarkali-teal', name: 'Anarkali Kurti with Chikankari Embroidery', category: 'kurti', price: 1899, mrp: 2400 },
  { id: 'amb-kurti-printed-rose', name: 'Block-printed Rayon Kurti Set', category: 'kurti', price: 1399, mrp: 1750 },
  { id: 'amb-kurti-palazzo-olive', name: 'Kurti & Palazzo Co-ord Set', category: 'kurti', price: 1699, mrp: 2100 },
  { id: 'amb-dress-indowestern-plum', name: 'Indo-Western Angrakha Dress', category: 'dress', price: 2199, mrp: 2700 },
  { id: 'amb-dress-flare-coral', name: 'Flared Ethnic Maxi Dress', category: 'dress', price: 1999, mrp: 2500 },
  { id: 'amb-dress-cape-ivory', name: 'Cape-sleeve Ethnic Dress', category: 'dress', price: 2399, mrp: 2900 },
  { id: 'amb-dress-jacket-mint', name: 'Jacket-style Ethnic Dress', category: 'dress', price: 2599, mrp: 3200 },
]

export function getProductsByCategory(slug) {
  return products.filter((product) => product.category === slug)
}

export function getProductById(id) {
  return products.find((product) => product.id === id)
}

export function toneFor(id) {
  const index = products.findIndex((product) => product.id === id)
  return TONES[index % TONES.length]
}
