import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Seo from '../components/seo/Seo'
import { thumbUrl, fallbackToOriginal } from '../utils/catalogue'
import { loadCatalogue, buildMenuSections, shopLink } from '../utils/menuTiles'

const RAIL_LINKS = [
  { label: 'New Arrivals', to: shopLink({ sort: 'newest' }) },
  { label: 'Bestsellers', to: shopLink({ sort: 'rating' }) },
]

export default function CategoriesPage() {
  const [products, setProducts] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState('sale')
  const refs = useRef({})

  useEffect(() => {
    loadCatalogue().then((list) => {
      setProducts(list)
      setLoaded(true)
    })
  }, [])

  const sections = useMemo(() => buildMenuSections(products), [products])

  // Highlight the rail item of the section currently under the top of the screen.
  useEffect(() => {
    if (!sections.length) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.dataset.section)
      },
      { rootMargin: '-25% 0px -60% 0px' }
    )
    Object.values(refs.current).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [sections])

  const jump = (id) => {
    setActive(id)
    refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto max-w-3xl pb-4">
      <Seo title="Shop by Category" description="Browse Vinit Textiles sarees by occasion, fabric, colour and price." />
      <div className="flex items-center justify-between border-b border-brown/10 bg-ivory px-4 py-3.5">
        <h1 className="text-[15px] font-bold uppercase tracking-[0.12em] text-brown">Category</h1>
        <Link to="/search" aria-label="Search" className="text-brown">
          <Search size={20} />
        </Link>
      </div>

      <div className="flex items-start">
        <aside className="sticky top-[68px] w-[104px] shrink-0 self-start sm:w-36">
          <ul className="max-h-[calc(100vh-130px)] overflow-y-auto border-r border-brown/10">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => jump(s.id)}
                  className={`block w-full border-b border-brown/10 px-2 py-4 text-center text-[12px] font-semibold uppercase leading-snug tracking-wide transition-colors ${
                    active === s.id ? 'border-l-[3px] border-l-maroon bg-maroon/5 text-maroon' : 'border-l-[3px] border-l-transparent text-brown-light'
                  }`}
                >
                  {s.title.replace(/^Sarees by /, '')}
                </button>
              </li>
            ))}
            {RAIL_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="block w-full border-b border-brown/10 border-l-[3px] border-l-transparent px-2 py-4 text-center text-[12px] font-semibold uppercase leading-snug tracking-wide text-brown-light"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 px-3 pb-6">
          {!loaded ? (
            <div className="mt-4 grid animate-pulse grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-cream" />
              ))}
            </div>
          ) : (
            sections.map((s) => (
              <section key={s.id} ref={(el) => (refs.current[s.id] = el)} data-section={s.id} className="scroll-mt-[64px] border-b border-brown/10 pb-6 last:border-b-0">
                <div className="flex items-center justify-between py-4">
                  <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-brown">{s.title}</h2>
                  <Link to={s.viewAll} className="text-[12px] font-bold uppercase tracking-wide text-maroon">
                    View all &gt;
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3">
                  {s.tiles.map((t) => (
                    <Link key={t.label} to={t.to} className="group block text-center">
                      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-cream">
                        {t.image && (
                          <img
                            src={thumbUrl(t.image)}
                            onError={fallbackToOriginal(t.image)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <span className="mt-1.5 block text-[13px] font-medium leading-tight text-brown">{t.label}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
