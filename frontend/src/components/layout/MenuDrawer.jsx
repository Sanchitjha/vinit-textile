import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CloseIcon } from '../icons/Icons'
import { thumbUrl, fallbackToOriginal } from '../../utils/catalogue'
import { loadCatalogue, buildMenuSections, shopLink } from '../../utils/menuTiles'

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

  const sections = useMemo(() => buildMenuSections(products), [products])

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
