// Every real Vinit Textiles product has a "VT-<number>" SKU. Seed/placeholder
// rows left in the database (lorem-ipsum name, random-word SKU) don't — so this
// keeps junk data out of the customer-facing listings until it's deleted in the
// admin panel. Admin screens deliberately don't use this, so bad rows stay
// visible there to be cleaned up.
//
// Product photos must come from product-images/ only — homepage/marketing art
// (hero-*, lookbook-*, occasion-*, banner-*, split-*, footer-bg under /images/)
// is never a real product photo, even on a row with a valid VT- SKU. A few
// early seed rows (VT-COT-004, VT-LIN-003, VT-ORG-002, VT-BAN-001) shipped
// with hero/lookbook images as filler before real photography existed — this
// guard keeps rows like that out of customer-facing listings too.
export function isRealProduct(product) {
  const sku = (product?.sku || '').trim()
  if (!/^VT-/i.test(sku)) return false
  const images = Array.isArray(product?.images) ? product.images : []
  return images.length > 0 && images.every((img) => /^\/product-images\//i.test(img || ''))
}

export function onlyRealProducts(list) {
  return Array.isArray(list) ? list.filter(isRealProduct) : []
}

// Colourway / alternate-photo SKUs share a base ("VT-1499", "VT-1499-BLUE", "VT-1499-V2" are one design).
export function designKey(product) {
  const sku = (product?.sku || '').toUpperCase()
  return sku.match(/^VT-\d+/)?.[0] || sku || String(product?.id || product?._id || '')
}

// One entry per design — the base SKU when it is in the list, otherwise the first variant.
// `skip` is a Set of design keys that must not appear (e.g. already shown elsewhere on the page).
export function uniqueDesigns(list, skip = new Set()) {
  const reps = new Map()
  ;(Array.isArray(list) ? list : []).forEach((p) => {
    const key = designKey(p)
    if (skip.has(key)) return
    const current = reps.get(key)
    if (!current || ((p.sku || '').toUpperCase() === key && (current.sku || '').toUpperCase() !== key)) reps.set(key, p)
  })
  return [...reps.values()]
}

// Small (480px) card/menu thumbnail for a product's first photo — see scripts/make-thumbs.mjs.
// Products without a generated thumbnail (e.g. newly uploaded) fall back to the full photo via onError.
export function thumbUrl(src) {
  const m = (src || '').match(/^\/product-images\/categories\/[^/]+\/([^/]+)\/(\d+)\.webp$/i)
  return m ? `/product-images/thumbs/${m[1]}-${m[2]}.webp` : src
}

export const fallbackToOriginal = (src) => (e) => {
  if (e.currentTarget.dataset.fallback) return
  e.currentTarget.dataset.fallback = '1'
  e.currentTarget.src = src
}
