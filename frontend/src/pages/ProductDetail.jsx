import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Placeholder from '../components/ui/Placeholder'
import ProductCard from '../components/ui/ProductCard'
import Button from '../components/ui/Button'
import { HeartIcon, MinusIcon, PlusIcon, StarIcon } from '../components/icons/Icons'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiClient } from '../api/client'
import { toneFor } from '../data/products'

const sizes = ['S', 'M', 'L', 'XL']

export default function ProductDetail() {
  const { id } = useParams() // id could be slug or actual id
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user, openAuthModal } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState([])
  const [categoryMeta, setCategoryMeta] = useState(null)

  const [size, setSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await apiClient.get(`/sarees/${id}`).catch(() => apiClient.get(`/sarees/slug/${id}`))
        const fetchedProduct = res.data
        setProduct(fetchedProduct)

        if (fetchedProduct) {
          const [catRes, relatedRes] = await Promise.all([
            apiClient.get(`/categories/${fetchedProduct.category}`),
            apiClient.get(`/sarees?category=${fetchedProduct.category}&limit=4`)
          ]).catch(() => [{data: null}, {data: {items: []}}])
          setCategoryMeta(catRes.data)
          setRelated(relatedRes.data?.items?.filter(p => p.id !== fetchedProduct.id) || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>
  }

  if (!product) {
    return (
      <section className="container-ambika py-20 text-center">
        <h1 className="font-display text-4xl text-brown">Product not found</h1>
        <p className="mt-4 text-sm text-brown-light">This piece may have sold out or moved.</p>
        <Link to="/shop/saree" className="mt-8 inline-block text-[11px] font-semibold uppercase tracking-widest text-brown hover:underline">
          Back to Saree collection
        </Link>
      </section>
    )
  }

  const discount = Math.round(100 - (product.price / product.mrp) * 100)

  return (
    <section className="container-ambika py-16">
      <nav className="text-[10px] uppercase tracking-[0.2em] text-brown-light">
        <Link to="/" className="hover:text-brown">
          HOME
        </Link>{' '}
        /{' '}
        <Link to={`/shop/${product.category}`} className="hover:text-brown">
          {categoryMeta?.name}
        </Link>{' '}
        / <span className="text-brown">{product.name}</span>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="flex gap-4">
          <div className="hidden flex-col gap-3 sm:flex">
            {[0, 1, 2, 3].map((thumb) => (
              <button
                key={thumb}
                type="button"
                onClick={() => setActiveThumb(thumb)}
                className={`h-24 w-20 overflow-hidden border ${
                  activeThumb === thumb ? 'border-brown' : 'border-transparent'
                } transition-colors`}
              >
                <Placeholder tone={toneFor(product.id)} ratio="aspect-[3/4]" />
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden bg-cream">
            <Placeholder label={product.name} tone={toneFor(product.id)} ratio="aspect-[3/4] sm:aspect-[4/5] w-full" />
          </div>
        </div>

        <div className="lg:sticky lg:top-32 h-fit">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brown-light">
            {categoryMeta?.name}
          </p>
          <h1 className="font-display mt-4 text-4xl text-brown leading-tight">{product.name}</h1>

          <div className="mt-4 flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="text-brown" />
            ))}
            <span className="text-[11px] uppercase tracking-widest text-brown-light">(24 REVIEWS)</span>
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-xl font-medium text-brown">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-brown-light line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-brown">{discount}% off</span>
          </div>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-brown-light">
            Handcrafted with care, this piece blends heritage-inspired design with a contemporary
            silhouette — finished with fine detailing so every thread tells a story.
          </p>

          <div className="mt-10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brown">Size</p>
            <div className="mt-3 flex gap-3">
              {sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  className={`flex h-12 w-12 items-center justify-center border text-[11px] font-semibold transition-colors rounded-none ${
                    size === option
                      ? 'border-brown bg-brown text-ivory'
                      : 'border-brown/20 text-brown hover:border-brown'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brown">Quantity</p>
              <div className="mt-3 flex items-center border border-brown/20 bg-transparent">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((n) => Math.max(1, n - 1))}
                  className="flex h-12 w-12 items-center justify-center text-brown hover:bg-cream transition-colors"
                >
                  <MinusIcon />
                </button>
                <span className="w-10 text-center text-[13px] font-medium text-brown">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((n) => n + 1)}
                  className="flex h-12 w-12 items-center justify-center text-brown hover:bg-cream transition-colors"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              variant="dark"
              className="sm:flex-1"
              onClick={() => {
                addToCart(product, size, qty)
                if (user) {
                  navigate('/cart')
                } else {
                  openAuthModal('login')
                }
              }}
            >
              BUY NOW
            </Button>
            <Button
              variant="primary"
              className="sm:flex-1"
              onClick={() => {
                addToCart(product, size, qty)
                setAdded(true)
              }}
            >
              ADD TO CART
            </Button>
          </div>

          <Button variant="outline" className="mt-4 w-full">
            <HeartIcon width={16} height={16} /> WISHLIST
          </Button>

          <div className="mt-4 space-y-1 text-[11px] uppercase tracking-widest text-brown-light">
            <p>Cash on delivery available</p>
            <p>Free shipping on orders above ₹1,999</p>
          </div>

          {added && (
            <p className="mt-4 text-[11px] uppercase tracking-widest font-medium text-brown">
              Added to cart.{' '}
              <button type="button" onClick={() => navigate('/cart')} className="underline hover:text-brown-light">
                VIEW CART
              </button>
            </p>
          )}

          <dl className="mt-12 space-y-4 border-t border-brown/10 pt-8 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-brown-light uppercase tracking-widest text-[10px] font-semibold">Fabric</dt>
              <dd className="text-brown font-medium">Pure silk blend</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brown-light uppercase tracking-widest text-[10px] font-semibold">Work</dt>
              <dd className="text-brown font-medium">Zari &amp; thread embroidery</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brown-light uppercase tracking-widest text-[10px] font-semibold">Care</dt>
              <dd className="text-brown font-medium">Dry clean only</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-32">
          <h2 className="font-display text-center text-4xl text-brown">You May Also Like</h2>
          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
