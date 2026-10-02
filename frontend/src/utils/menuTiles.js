import { apiClient } from '../api/client'
import { onlyRealProducts, uniqueDesigns } from './catalogue'

// Fetched once per page load, then reused by the menu drawer and the mobile Category page.
let catalogueRequest = null
export function loadCatalogue() {
  if (!catalogueRequest) {
    catalogueRequest = apiClient
      .get('/sarees?limit=100')
      .then((res) => onlyRealProducts(res.data?.items))
      .catch(() => {
        catalogueRequest = null
        return []
      })
  }
  return catalogueRequest
}

const PRICE_TILES = [
  { label: 'Under ₹1,500', id: 'u1500', test: (p) => p < 1500 },
  { label: '₹1,500 – ₹2,000', id: '1500-2000', test: (p) => p >= 1500 && p < 2000 },
  { label: '₹2,000 & Above', id: '2000+', test: (p) => p >= 2000 },
]

export const shopLink = (params) => `/shop/all?${new URLSearchParams(params).toString()}`

// Picks a photo per tile from a saree that matches it — always the least-used matching photo, so the
// same saree isn't repeated across tiles while an unused one is available.
function buildTiles(values, designs, matches, toLink, makeLabel, usage) {
  return values.map((value) => {
    const pool = designs.filter((p) => matches(p, value))
    const pick = [...pool].sort((a, b) => (usage.get(a.images?.[0]) || 0) - (usage.get(b.images?.[0]) || 0))[0]
    if (pick) usage.set(pick.images?.[0], (usage.get(pick.images?.[0]) || 0) + 1)
    return { label: makeLabel(value), to: toLink(value), image: pick?.images?.[0] }
  })
}

function tally(designs, pick) {
  const map = new Map()
  designs.forEach((p) => pick(p).filter(Boolean).forEach((v) => map.set(v, (map.get(v) || 0) + 1)))
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([v]) => v)
}

// Sections of image tiles built from the live catalogue — each tile deep-links into /shop/...
export function buildMenuSections(products) {
  const designs = uniqueDesigns(products)
  if (designs.length === 0) return []
  const usage = new Map()

  const sale = buildTiles(
    PRICE_TILES.map((r) => r.id),
    designs,
    (p, id) => PRICE_TILES.find((r) => r.id === id).test(p.price),
    (id) => shopLink({ price: id }),
    (id) => PRICE_TILES.find((r) => r.id === id).label,
    usage
  )
  sale.push(...buildTiles(['all'], designs, () => true, () => shopLink({ sort: 'price-asc' }), () => 'All Sarees on Sale', usage))

  const cats = new Map()
  designs.forEach((p) => {
    const slug = p.category?.slug
    if (slug && !cats.has(slug)) cats.set(slug, p.category?.name || slug)
  })
  const categoryTiles = buildTiles(
    [...cats.keys()],
    designs,
    (p, slug) => p.category?.slug === slug,
    (slug) => `/shop/${slug}`,
    (slug) => cats.get(slug),
    usage
  )

  const occasions = tally(designs, (p) => p.occasion || []).slice(0, 8)
  const fabrics = tally(designs, (p) => [p.fabric]).slice(0, 6)
  const colours = tally(designs, (p) => (p.colors?.length ? p.colors : [p.color])).slice(0, 8)

  return [
    { id: 'sale', title: 'Sale', viewAll: shopLink({ sort: 'price-asc' }), tiles: sale },
    { id: 'category', title: 'Shop by Category', viewAll: '/shop/all', tiles: categoryTiles },
    {
      id: 'occasion',
      title: 'Sarees by Occasion',
      viewAll: '/shop/all',
      tiles: buildTiles(occasions, designs, (p, v) => (p.occasion || []).includes(v), (v) => shopLink({ occasion: v }), (v) => `${v} Sarees`, usage),
    },
    {
      id: 'fabric',
      title: 'Sarees by Fabric',
      viewAll: '/shop/all',
      tiles: buildTiles(fabrics, designs, (p, v) => p.fabric === v, (v) => shopLink({ fabric: v }), (v) => `${v} Sarees`, usage),
    },
    {
      id: 'colour',
      title: 'Sarees by Colour',
      viewAll: '/shop/all',
      tiles: buildTiles(
        colours,
        designs,
        (p, v) => (p.colors?.length ? p.colors : [p.color]).includes(v),
        (v) => shopLink({ color: v }),
        (v) => `${v} Sarees`,
        usage
      ),
    },
  ]
}
