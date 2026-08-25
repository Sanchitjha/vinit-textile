import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import { apiClient } from '../api/client'

const filterGroups = [
  { title: 'Price', options: ['Under ₹2,000', '₹2,000 – ₹5,000', '₹5,000 – ₹10,000', 'Above ₹10,000'] },
  { title: 'Fabric', options: ['Silk', 'Cotton', 'Georgette', 'Velvet', 'Net'] },
  { title: 'Color', options: ['Red', 'Maroon', 'Green', 'Mustard', 'Ivory'] },
  { title: 'Size', options: ['XS', 'S', 'M', 'L', 'XL'] },
]

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest']

export default function ProductListing() {
  const { category } = useParams()
  const [sort, setSort] = useState(sortOptions[0])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [catRes, prodRes] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get(`/sarees?categorySlug=${category}`)
        ])
        setCategories(catRes.data || [])
        setProducts(prodRes.data?.items || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [category])

  const meta = categories.find((c) => c.slug === category) ?? { name: category, slug: category }

  const items = useMemo(() => {
    const list = [...products]
    if (sort === 'Price: Low to High') list.sort((a, b) => a.price - b.price)
    if (sort === 'Price: High to Low') list.sort((a, b) => b.price - a.price)
    return list
  }, [products, sort])

  return (
    <section className="container-ambika py-10">
      <nav className="text-xs uppercase tracking-wide text-stone">
        <Link to="/" className="hover:text-brown">
          Home
        </Link>{' '}
        / <span className="text-brown">{meta.name}</span>
      </nav>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-display text-4xl text-maroon">{meta.name}</h1>
        <p className="text-sm text-stone">{items.length} products</p>
      </div>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="flex gap-2 overflow-x-auto pb-4 lg:hidden">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className={`shrink-0 border px-4 py-2 text-xs font-medium uppercase tracking-wide ${
                  cat.slug === meta.slug
                    ? 'border-brown bg-brown text-ivory'
                    : 'border-cream-dark text-brown'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="hidden space-y-8 lg:block">
            <div>
              <h2 className="font-display text-lg text-maroon">Categories</h2>
              <ul className="mt-3 space-y-2">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      to={`/shop/${cat.slug}`}
                      className={`text-sm ${
                        cat.slug === meta.slug ? 'font-semibold text-brown' : 'text-brown/70 hover:text-brown'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {filterGroups.map((group) => (
              <div key={group.title}>
                <h2 className="font-display text-lg text-maroon">{group.title}</h2>
                <ul className="mt-3 space-y-2">
                  {group.options.map((option) => (
                    <li key={option}>
                      <label className="flex items-center gap-2 text-sm text-brown/80">
                        <input type="checkbox" className="accent-brown" />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex justify-end">
            <label className="flex items-center gap-2 text-xs text-brown">
              Sort by
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="border border-cream-dark bg-ivory px-3 py-2 text-xs text-maroon focus:border-brown focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-stone">No products found in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
