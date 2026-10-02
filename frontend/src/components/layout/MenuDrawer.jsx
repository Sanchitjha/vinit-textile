import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CloseIcon } from '../icons/Icons'
import { apiClient } from '../../api/client'
import { onlyRealProducts, uniqueDesigns, thumbUrl, fallbackToOriginal } from '../../utils/catalogue'

// Fetched once per page load, then reused every time the menu opens.
let catalogueRequest = null
function loadCatalogue() {
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

const shopLink = (params) => `/shop/all?${new URLSearchParams(params).toString()}`

// Picks a photo per tile from the saree that matches it, avoiding photos already used by another tile.
function buildTiles(values, designs, matches, toLink, makeLabel) {
  const used = new Set()
  return values.map(([value]) => {
    const pool = designs.filter((p) => matches(p, value))
    const pick = pool.find((p) => !used.has(p.images?.[0])) || pool[0]
    if (pick) used.add(pick.images?.[0])
    return { label: makeLabel(value), to: toLink(value), image: pick?.images?.[0] }
  })
}

function tally(designs, pick) {
  const map = new Map()
  designs.forEach((p) => pick(p).filter(Boolean).forEach((v) => map.set(v, (map.get(v) || 0) + 1)))
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

function Tile({ tile, onClose }) {
  return (
    <Link to={tile.to} onClick={onClose} className="group block text-center">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-cream">
        {tile.image && (
          <img
            src={thumbUrl(tile.image)}
            onError={fallbackToOriginal(tile.image)}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <span className="mt-1.5 block text-[11px] leading-tight text-brown">{tile.label}</span>
    </Link>
  )
}

function Section({ title, tiles, onClose }) {
  if (!tiles.length) return null
  return (
    <section className="mt-7 first:mt-0">
      <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[0.15em] text-brown">{title}</h3>
      <div className="grid grid-cols-3 gap-x-2.5 gap-y-4 sm:grid-cols-4">
        {tiles.map((tile) => (
          <Tile key={tile.label} tile={tile} onClose={onClose} />
        ))}
      </div>
    </section>
  )
}

export default function MenuDrawer({ open, onClose }) {
  const [products, setProducts] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    loadCatalogue().then((list) => {
      if (!cancelled) {
        setProducts(list)
        setLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const sections = useMemo(() => {
    const designs = uniqueDesigns(products)
    if (designs.length === 0) return []

    const sale = buildTiles(
      PRICE_TILES.map((r) => [r.id]),
      designs,
      (p, id) => PRICE_TILES.find((r) => r.id === id).test(p.price),
      (id) => shopLink({ price: id }),
      (id) => PRICE_TILES.find((r) => r.id === id).label
    )
    sale.push({ label: 'All Sarees on Sale', to: shopLink({ sort: 'price-asc' }), image: designs[0]?.images?.[0] })

    const occasions = tally(designs, (p) => p.occasion || []).slice(0, 8)
    const fabrics = tally(designs, (p) => [p.fabric]).slice(0, 6)
    const colours = tally(designs, (p) => (p.colors?.length ? p.colors : [p.color])).slice(0, 8)

    return [
      { title: 'Sale', tiles: sale },
      {
        title: 'Sarees by Occasion',
        tiles: buildTiles(occasions, designs, (p, v) => (p.occasion || []).includes(v), (v) => shopLink({ occasion: v }), (v) => `${v} Sarees`),
      },
      {
        title: 'Sarees by Fabric',
        tiles: buildTiles(fabrics, designs, (p, v) => p.fabric === v, (v) => shopLink({ fabric: v }), (v) => `${v} Sarees`),
      },
      {
        title: 'Sarees by Colour',
        tiles: buildTiles(
          colours,
          designs,
          (p, v) => (p.colors?.length ? p.colors : [p.color]).includes(v),
          (v) => shopLink({ color: v }),
          (v) => `${v} Sarees`
        ),
      },
    ]
  }, [products])

  if (!open) return null

  const quickLinks = [
    { label: 'Best Sellers', to: shopLink({ sort: 'rating' }) },
    { label: 'New Arrivals', to: shopLink({ sort: 'newest' }) },
    { label: 'All Sarees', to: '/shop/all' },
    { label: 'Bridal', to: '/shop/bridal-saree' },
    { label: 'Partywear', to: '/shop/partywear' },
    { label: 'Silk Sarees', to: '/shop/silk-saree' },
  ]
  const infoLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Track Order', to: '/track-order' },
    { label: 'Returns', to: '/returns-policy' },
    { label: 'FAQs', to: '/faqs' },
    { label: 'Size Chart', to: '/size-chart' },
  ]

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="menu-drawer-panel absolute left-0 top-0 flex h-full w-full flex-col bg-white shadow-2xl sm:w-[540px]">
        <div className="flex items-center justify-between border-b border-brown/10 px-5 py-4">
          <Link to="/" onClick={onClose} className="font-display text-lg tracking-wide text-maroon">
            Vinit Textiles
          </Link>
          <button type="button" aria-label="Close menu" onClick={onClose} className="text-brown hover:text-maroon">
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-6 flex flex-wrap gap-2">
            {quickLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={onClose}
                className="rounded-full border border-brown/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-brown transition-colors hover:border-maroon hover:bg-maroon hover:text-ivory"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {!loaded ? (
            <div className="grid animate-pulse grid-cols-3 gap-2.5 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-lg bg-cream" />
              ))}
            </div>
          ) : (
            sections.map((s) => <Section key={s.title} title={s.title} tiles={s.tiles} onClose={onClose} />)
          )}

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-brown/10 pt-5 text-[12px] text-brown-light">
            {infoLinks.map((l) => (
              <Link key={l.label} to={l.to} onClick={onClose} className="hover:text-maroon hover:underline">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
