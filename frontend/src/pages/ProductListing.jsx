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
    <section className="container-ambika py-16">
      <nav className="text-[10px] uppercase tracking-[0.2em] text-brown-light">
        <Link to="/" className="hover:text-brown">
          HOME
        </Link>{' '}
        / <span className="text-brown">{meta.name}</span>
      </nav>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-display text-4xl text-brown sm:text-5xl">{meta.name}</h1>
        <p className="text-xs uppercase tracking-widest text-brown-light">{items.length} PRODUCTS</p>
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

          <div className="hidden space-y-12 lg:block">
            <div>
              <h2 className="font-display text-xl text-brown">Categories</h2>
              <ul className="mt-5 space-y-3 text-[13px]">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      to={`/shop/${cat.slug}`}
                      className={`${
                        cat.slug === meta.slug ? 'font-medium text-brown' : 'text-brown-light hover:text-brown'
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
                <h2 className="font-display text-xl text-brown">{group.title}</h2>
                <ul className="mt-5 space-y-3 text-[13px]">
                  {group.options.map((option) => (
                    <li key={option}>
                      <label className="flex cursor-pointer items-center gap-3 text-brown-light hover:text-brown transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded-none border-brown/20 accent-brown bg-transparent" />
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
          <div className="mb-10 flex justify-end">
            <label className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-brown-light">
              SORT BY
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="border-b border-brown/20 bg-transparent py-1 pr-6 text-[11px] font-medium text-brown uppercase tracking-widest focus:border-brown focus:outline-none appearance-none"
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
            <p className="text-sm text-brown-light">No products found in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3">
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
