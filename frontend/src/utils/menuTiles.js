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

// Picks a photo per tile from a saree that matches it, avoiding photos already used by another tile.
function buildTiles(values, designs, matches, toLink, makeLabel) {
  const used = new Set()
  return values.map((value) => {
    const pool = designs.filter((p) => matches(p, value))
    const pick = pool.find((p) => !used.has(p.images?.[0])) || pool[0]
    if (pick) used.add(pick.images?.[0])
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

  const sale = buildTiles(
    PRICE_TILES.map((r) => r.id),
    designs,
    (p, id) => PRICE_TILES.find((r) => r.id === id).test(p.price),
    (id) => shopLink({ price: id }),
    (id) => PRICE_TILES.find((r) => r.id === id).label
  )
  sale.push({ label: 'All Sarees on Sale', to: shopLink({ sort: 'price-asc' }), image: designs[0]?.images?.[0] })

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
    (slug) => cats.get(slug)
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
      tiles: buildTiles(occasions, designs, (p, v) => (p.occasion || []).includes(v), (v) => shopLink({ occasion: v }), (v) => `${v} Sarees`),
    },
    {
      id: 'fabric',
      title: 'Sarees by Fabric',
      viewAll: '/shop/all',
      tiles: buildTiles(fabrics, designs, (p, v) => p.fabric === v, (v) => shopLink({ fabric: v }), (v) => `${v} Sarees`),
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
        (v) => `${v} Sarees`
      ),
    },
  ]
}
