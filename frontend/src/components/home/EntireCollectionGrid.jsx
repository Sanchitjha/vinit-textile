import { useState, useEffect, useMemo } from 'react'
import ProductCard from '../ui/ProductCard'
import { apiClient } from '../../api/client'
import { products as fallbackProducts } from '../../data/products'
import { onlyRealProducts } from '../../utils/catalogue'

export default function EntireCollectionGrid() {
  const [activeType, setActiveType] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAllProducts() {
      try {
        setLoading(true)
        const res = await apiClient.get('/sarees?limit=50')
        const items = onlyRealProducts(res.data?.items)
        setProducts(items.length > 0 ? items : fallbackProducts)
      } catch (err) {
        console.warn('Backend connection fallback for full grid:', err.message)
        setProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }
    loadAllProducts()
  }, [])

  // Build the filter pills from the fabric/weave types that actually exist in
  // the loaded catalogue, so a pill can never lead to an empty grid.
  const types = useMemo(() => {
    const set = new Set()
    products.forEach((p) => {
      const t = p.sareeType || p.weave
      if (t) set.add(t)
    })
    return ['all', ...[...set].sort()]
  }, [products])

  const filteredProducts = useMemo(() => {
    if (activeType === 'all') return products
    return products.filter((p) => (p.sareeType || p.weave) === activeType)
  }, [products, activeType])

  return (
    <section className="bg-cream-light/50 py-16 border-t border-terracotta/10">
      <div className="container-ambika">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-terracotta uppercase">
            Surat Manufacturer Collection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-brown mt-1">
            Our Entire Saree Collection
          </h2>
          <p className="text-sm text-brown-light mt-2 font-body">
            Directly from master looms to your wardrobe — tap any saree to see full details.
          </p>
        </div>

        {/* Filter pills — only shown when there's more than one type */}
        {!loading && types.length > 2 && (
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-12">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-5 py-2.5 text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 font-medium ${
                  activeType === t
                    ? 'bg-brown text-ivory shadow-md scale-[1.02]'
                    : 'bg-ivory text-brown hover:bg-cream border border-terracotta/15'
                }`}
              >
                {t === 'all' ? 'All Sarees' : t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] w-full rounded bg-cream" />
                <div className="mt-3 h-3 w-3/4 rounded bg-cream" />
                <div className="mt-2 h-3 w-1/2 rounded bg-cream" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-brown-light">
            <p>No sarees found in this category.</p>
            <button
              onClick={() => setActiveType('all')}
              className="mt-4 text-xs font-semibold text-terracotta underline uppercase tracking-wider"
            >
              View All Sarees
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
