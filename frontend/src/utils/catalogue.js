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
