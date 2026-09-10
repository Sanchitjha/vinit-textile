import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import { onlyRealProducts } from '../utils/catalogue'
import { apiClient } from '../api/client'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(Boolean(q))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!q) {
      setProducts([])
      setLoading(false)
      return undefined
    }
    let cancelled = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const res = await apiClient.get(`/sarees?search=${encodeURIComponent(q)}`)
        if (!cancelled) setProducts(onlyRealProducts(res.data?.items))
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [q])

  return (
    <section className="container-ambika py-16">
      <nav className="text-[10px] uppercase tracking-[0.2em] text-brown-light">
        <Link to="/" className="hover:text-brown">
          HOME
        </Link>{' '}
        / <span className="text-brown">SEARCH</span>
      </nav>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-display text-4xl text-brown sm:text-5xl">
          {q ? `Results for "${q}"` : 'Search'}
        </h1>
        {!loading && q && (
          <p className="text-xs uppercase tracking-widest text-brown-light">{products.length} PRODUCTS</p>
        )}
      </div>

      <div className="mt-10">
        {!q ? (
          <p className="text-sm text-brown-light">Type something in the search bar to find sarees, lehengas and more.</p>
        ) : loading ? (
          <p className="text-sm text-brown-light">Searching…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-brown-light">No products found for &ldquo;{q}&rdquo;. Try a different search.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
