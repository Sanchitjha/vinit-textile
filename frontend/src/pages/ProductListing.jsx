import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SareeCard from '../components/ui/SareeCard'
import { CloseIcon, ChevronDownIcon } from '../components/icons/Icons'
import { onlyRealProducts, uniqueDesigns, designKey } from '../utils/catalogue'
import { apiClient } from '../api/client'
import Seo from '../components/seo/Seo'
import { SITE_URL } from '../lib/seoConfig'

const PRICE_RANGES = [
  { id: 'u1500', label: 'Under ₹1,500', test: (p) => p < 1500 },
  { id: '1500-2000', label: '₹1,500 – ₹2,000', test: (p) => p >= 1500 && p < 2000 },
  { id: '2000+', label: '₹2,000 & above', test: (p) => p >= 2000 },
]

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest' },
]

const COLOR_DOTS = {
  Red: '#C62828', Blue: '#2F6DB5', Green: '#5E8C3A', Yellow: '#F2B705', Orange: '#E67E22', Purple: '#7E57C2',
  Pink: '#E91E8C', Brown: '#8D5A3B', White: '#F5F0E6', Beige: '#D9C7A5', Grey: '#9E9E9E', Maroon: '#6B1020',
  Multicolor: 'linear-gradient(135deg,#C62828,#F2B705,#2F6DB5,#5E8C3A)',
}

const EMPTY_FILTERS = { price: [], fabric: [], color: [], occasion: [] }

// Counts are per design (colourway SKUs of one saree count once).
function countBy(list, pick) {
  const map = new Map()
  list.forEach((p) => {
    const key = designKey(p)
    pick(p).filter(Boolean).forEach((v) => {
      if (!map.has(v)) map.set(v, new Set())
      map.get(v).add(key)
    })
  })
  return [...map.entries()].map(([v, keys]) => [v, keys.size]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

function FilterGroup({ title, children }) {
  return (
    <details open className="group border-b border-brown/10 py-5 first:pt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg text-brown [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDownIcon className="h-4 w-4 text-brown-light transition-transform group-open:rotate-180" />
      </summary>
      <ul className="mt-4 space-y-3 text-[13px]">{children}</ul>
    </details>
  )
}

function FilterOption({ checked, onChange, label, count, dot }) {
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-3 text-brown-light transition-colors hover:text-brown">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 shrink-0 rounded-none border-brown/30 accent-brown"
        />
        {dot && (
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 rounded-full border border-brown/20"
            style={{ background: dot }}
          />
        )}
        <span className={checked ? 'font-medium text-brown' : ''}>{label}</span>
        {count != null && <span className="ml-auto text-[11px] text-brown-light/70">{count}</span>}
      </label>
    </li>
  )
}

function FilterPanel({ facets, filters, toggle }) {
  return (
    <div>
      <FilterGroup title="Price">
        {PRICE_RANGES.map((r) => (
          <FilterOption
            key={r.id}
            label={r.label}
            count={facets.price[r.id]}
            checked={filters.price.includes(r.id)}
            onChange={() => toggle('price', r.id)}
          />
        ))}
      </FilterGroup>
      {facets.fabric.length > 1 && (
        <FilterGroup title="Fabric">
          {facets.fabric.map(([name, count]) => (
            <FilterOption key={name} label={name} count={count} checked={filters.fabric.includes(name)} onChange={() => toggle('fabric', name)} />
          ))}
        </FilterGroup>
      )}
      {facets.color.length > 1 && (
        <FilterGroup title="Colour">
          {facets.color.map(([name, count]) => (
            <FilterOption
              key={name}
              label={name}
              count={count}
              dot={COLOR_DOTS[name] || '#ccc'}
              checked={filters.color.includes(name)}
              onChange={() => toggle('color', name)}
            />
          ))}
        </FilterGroup>
      )}
      {facets.occasion.length > 1 && (
        <FilterGroup title="Occasion">
          {facets.occasion.map(([name, count]) => (
            <FilterOption key={name} label={name} count={count} checked={filters.occasion.includes(name)} onChange={() => toggle('occasion', name)} />
          ))}
        </FilterGroup>
      )}
    </div>
  )
}

export default function ProductListing() {
  const { category } = useParams()
  const [sort, setSort] = useState('featured')
  const [categories, setCategories] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([apiClient.get('/categories'), apiClient.get('/sarees?limit=100')])
        setCategories(catRes.data || [])
        setAllProducts(onlyRealProducts(prodRes.data?.items))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setFilters(EMPTY_FILTERS)
    setDrawerOpen(false)
  }, [category])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const meta = categories.find((c) => c.slug === category) ?? { name: category, slug: category }

  const inCategory = useMemo(
    () => allProducts.filter((p) => (p.category?.slug || p.category) === category),
    [allProducts, category]
  )

  const visibleCategories = useMemo(() => {
    const counts = {}
    categories.forEach((c) => {
      counts[c.slug] = uniqueDesigns(allProducts.filter((p) => (p.category?.slug || p.category) === c.slug)).length
    })
    return categories.filter((c) => counts[c.slug] > 0 || c.slug === category).map((c) => ({ ...c, count: counts[c.slug] || 0 }))
  }, [categories, allProducts, category])

  const totalDesigns = useMemo(() => uniqueDesigns(inCategory).length, [inCategory])

  const facets = useMemo(
    () => ({
      price: Object.fromEntries(PRICE_RANGES.map((r) => [r.id, uniqueDesigns(inCategory.filter((p) => r.test(p.price))).length])),
      fabric: countBy(inCategory, (p) => [p.fabric]),
      color: countBy(inCategory, (p) => (p.colors?.length ? p.colors : [p.color])),
      occasion: countBy(inCategory, (p) => p.occasion || []),
    }),
    [inCategory]
  )

  const items = useMemo(() => {
    const priceTests = PRICE_RANGES.filter((r) => filters.price.includes(r.id))
    const list = inCategory.filter((p) => {
      if (priceTests.length && !priceTests.some((r) => r.test(p.price))) return false
      if (filters.fabric.length && !filters.fabric.includes(p.fabric)) return false
      if (filters.color.length && !(p.colors?.length ? p.colors : [p.color]).some((c) => filters.color.includes(c))) return false
      if (filters.occasion.length && !(p.occasion || []).some((o) => filters.occasion.includes(o))) return false
      return true
    })
    // one card per design: the base SKU if it matches the filters, otherwise the first matching colourway
    const designs = uniqueDesigns(list)
    if (sort === 'price-asc') designs.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') designs.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') designs.sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
    else if (sort === 'newest') designs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    return designs
  }, [inCategory, filters, sort])

  const toggle = (group, value) =>
    setFilters((f) => ({
      ...f,
      [group]: f[group].includes(value) ? f[group].filter((v) => v !== value) : [...f[group], value],
    }))

  const labelFor = (group, value) => (group === 'price' ? PRICE_RANGES.find((r) => r.id === value)?.label : value)
  const activeChips = Object.entries(filters).flatMap(([group, values]) => values.map((v) => ({ group, value: v })))
  const clearAll = () => setFilters(EMPTY_FILTERS)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: meta.name, item: `${SITE_URL}/shop/${category}` },
    ],
  }

  return (
    <section className="container-ambika py-10 sm:py-14">
      <Seo
        title={meta.name}
        description={`Shop ${meta.name} at Vinit Textiles — premium sarees crafted for every celebration, direct from our Surat manufacturing hub.`}
        jsonLd={breadcrumbJsonLd}
      />
      <nav className="text-[10px] uppercase tracking-[0.2em] text-brown-light">
        <Link to="/" className="hover:text-brown">
          HOME
        </Link>{' '}
        / <span className="text-brown">{meta.name}</span>
      </nav>

      <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-display text-4xl text-brown sm:text-5xl">{meta.name}</h1>
        <p className="text-xs uppercase tracking-widest text-brown-light">
          {loading ? 'Loading…' : `${items.length} ${items.length === 1 ? 'product' : 'products'}`}
        </p>
      </div>

      {visibleCategories.length > 1 && (
        <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {visibleCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop/${cat.slug}`}
              className={`shrink-0 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                cat.slug === category
                  ? 'border-brown bg-brown text-ivory'
                  : 'border-brown/20 text-brown hover:border-brown'
              }`}
            >
              {cat.name} <span className="opacity-60">({cat.count})</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-10 lg:flex-row">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-3 no-scrollbar">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brown">Filters</h2>
              {activeChips.length > 0 && (
                <button type="button" onClick={clearAll} className="text-[11px] uppercase tracking-widest text-maroon underline">
                  Clear all
                </button>
              )}
            </div>
            <FilterPanel facets={facets} filters={filters} toggle={toggle} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4 border-y border-brown/10 py-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-brown lg:hidden"
            >
              Filters{activeChips.length > 0 && <span className="rounded-full bg-brown px-1.5 text-[10px] text-ivory">{activeChips.length}</span>}
            </button>
            <span className="hidden text-[11px] uppercase tracking-widest text-brown-light lg:block">
              Showing {items.length} of {totalDesigns}
            </span>
            <label className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-brown-light">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer border-b border-brown/20 bg-transparent py-1 pr-2 text-[11px] font-medium uppercase tracking-widest text-brown focus:border-brown focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {activeChips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeChips.map(({ group, value }) => (
                <button
                  key={`${group}-${value}`}
                  type="button"
                  onClick={() => toggle(group, value)}
                  className="flex items-center gap-1.5 rounded-full bg-cream-dark/60 px-3 py-1 text-[11px] text-brown hover:bg-cream-dark"
                >
                  {labelFor(group, value)} <CloseIcon width={10} height={10} />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="text-[11px] uppercase tracking-widest text-maroon underline">
                Clear all
              </button>
            </div>
          )}

          <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4.1] w-full bg-cream-dark/50" />
                    <div className="mt-3 h-3 w-4/5 bg-cream-dark/50" />
                    <div className="mt-2 h-3 w-1/3 bg-cream-dark/50" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-display text-2xl text-brown">No sarees match these filters</p>
                <p className="mt-2 text-sm text-brown-light">
                  {totalDesigns === 0 ? 'This category has no products yet.' : 'Try removing a filter to see more.'}
                </p>
                {activeChips.length > 0 && (
                  <button type="button" onClick={clearAll} className="mt-6 border border-brown px-6 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-brown hover:bg-brown hover:text-ivory">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {items.map((product) => (
                  <SareeCard key={product.id || product._id} product={product} bestseller={Boolean(product.isFeatured)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-ivory">
            <div className="flex items-center justify-between border-b border-brown/10 px-5 py-4">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-brown">Filters</h2>
              <button type="button" aria-label="Close" onClick={() => setDrawerOpen(false)} className="text-brown">
                <CloseIcon width={18} height={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterPanel facets={facets} filters={filters} toggle={toggle} />
            </div>
            <div className="flex gap-3 border-t border-brown/10 px-5 py-4">
              <button type="button" onClick={clearAll} className="flex-1 border border-brown/30 py-3 text-[11px] font-semibold uppercase tracking-widest text-brown">
                Clear all
              </button>
              <button type="button" onClick={() => setDrawerOpen(false)} className="flex-1 bg-brown py-3 text-[11px] font-semibold uppercase tracking-widest text-ivory">
                Show {items.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
