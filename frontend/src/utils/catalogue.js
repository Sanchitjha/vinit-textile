// Every real Vinit Textiles product has a "VT-<number>" SKU. Seed/placeholder
// rows left in the database (lorem-ipsum name, random-word SKU) don't — so this
// keeps junk data out of the customer-facing listings until it's deleted in the
// admin panel. Admin screens deliberately don't use this, so bad rows stay
// visible there to be cleaned up.
export function isRealProduct(product) {
  const sku = (product?.sku || '').trim()
  return /^VT-/i.test(sku)
}

export function onlyRealProducts(list) {
  return Array.isArray(list) ? list.filter(isRealProduct) : []
}
