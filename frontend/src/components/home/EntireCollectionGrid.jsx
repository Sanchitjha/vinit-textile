import { useState, useEffect } from 'react'
import ProductCard from '../ui/ProductCard'
import { apiClient } from '../../api/client'
import { products as fallbackProducts } from '../../data/products'

export default function EntireCollectionGrid() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'all', label: 'All Drapes & Sarees' },
    { id: 'silk-saree', label: 'Silk Sarees' },
    { id: 'bridal-saree', label: 'Bridal Edit' },
    { id: 'partywear', label: 'Partywear & Organza' },
    { id: 'cotton-saree', label: 'Handloom Cotton' },
    { id: 'lehenga', label: 'Lehenga Choli' },
    { id: 'kurti', label: 'Kurtis & Sets' },
  ]

  useEffect(() => {
    async function loadAllProducts() {
      try {
        setLoading(true)
        const res = await apiClient.get('/sarees?limit=50')
        const items = res.data?.items || []
        if (items.length > 0) {
          setProducts(items)
        } else {
          setProducts(fallbackProducts)
        }
      } catch (err) {
        console.warn('Backend connection fallback for full grid:', err.message)
        setProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }
    loadAllProducts()
  }, [])

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => {
        const catSlug = typeof p.category === 'object' ? p.category?.slug : p.category
        return catSlug === activeCategory || p.fabric?.toLowerCase().includes(activeCategory)
      })

  return (
    <section className="bg-cream-light/50 py-16 border-t border-terracotta/10">
      <div className="container-ambika">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-terracotta uppercase">
            Surat Manufacturer Collection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-brown mt-1">
            Our Entire Saree & Drapes Collection
          </h2>
          <p className="text-sm text-brown-light mt-2 font-body">
            Directly from master looms to your wardrobe — authentic fabrics at manufacturing-rate pricing.
          </p>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300 font-medium ${
                activeCategory === cat.id
                  ? 'bg-brown text-ivory shadow-md scale-[1.02]'
                  : 'bg-ivory text-brown hover:bg-cream border border-terracotta/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dense Koskii Style 5-Column Grid */}
        {loading ? (
          <div className="py-20 text-center text-brown-light text-sm animate-pulse">
            Loading drapes from looms...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-brown-light">
            <p>No drapes found in this category.</p>
            <button
              onClick={() => setActiveCategory('all')}
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
