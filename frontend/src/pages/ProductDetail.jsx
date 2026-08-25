import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Placeholder from '../components/ui/Placeholder'
import ProductCard from '../components/ui/ProductCard'
import Button from '../components/ui/Button'
import { HeartIcon, MinusIcon, PlusIcon, StarIcon } from '../components/icons/Icons'
import { categories, getProductById, getProductsByCategory, toneFor } from '../data/products'
import { useCart } from '../context/CartContext'

const sizes = ['S', 'M', 'L', 'XL']

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = getProductById(id)
  const [size, setSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [activeThumb, setActiveThumb] = useState(0)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <section className="container-ambika py-20 text-center">
        <h1 className="font-display text-3xl text-maroon">Product not found</h1>
        <p className="mt-3 text-sm text-stone">This piece may have sold out or moved.</p>
        <Link to="/shop/saree" className="mt-6 inline-block text-sm font-semibold text-brown hover:underline">
          Back to Saree collection
        </Link>
      </section>
    )
  }

  const categoryMeta = categories.find((c) => c.slug === product.category)
  const discount = Math.round(100 - (product.price / product.mrp) * 100)
  const related = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <section className="container-ambika py-10">
      <nav className="text-xs uppercase tracking-wide text-stone">
        <Link to="/" className="hover:text-brown">
          Home
        </Link>{' '}
        /{' '}
        <Link to={`/shop/${product.category}`} className="hover:text-brown">
          {categoryMeta?.name}
        </Link>{' '}
        / <span className="text-brown">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="flex gap-4">
          <div className="hidden flex-col gap-3 sm:flex">
            {[0, 1, 2, 3].map((thumb) => (
              <button
                key={thumb}
                type="button"
                onClick={() => setActiveThumb(thumb)}
                className={`h-20 w-16 overflow-hidden border ${
                  activeThumb === thumb ? 'border-brown' : 'border-cream-dark'
                }`}
              >
                <Placeholder tone={toneFor(product.id)} ratio="aspect-[3/4]" />
              </button>
            ))}
          </div>
          <div className="flex-1">
            <Placeholder label={product.name} tone={toneFor(product.id)} ratio="aspect-[3/4]" />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-olive">
            {categoryMeta?.name}
          </p>
          <h1 className="font-display mt-3 text-3xl text-maroon">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="text-olive" />
            ))}
            <span className="text-xs text-stone">(24 reviews)</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-brown">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-stone line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-maroon">{discount}% off</span>
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-brown/80">
            Handcrafted with care, this piece blends heritage-inspired design with a contemporary
            silhouette — finished with fine detailing so every thread tells a story.
          </p>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-brown">Size</p>
            <div className="mt-2 flex gap-2">
              {sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSize(option)}
                  className={`h-10 w-10 border text-xs font-semibold ${
                    size === option
                      ? 'border-brown bg-brown text-ivory'
                      : 'border-cream-dark text-brown hover:border-brown'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brown">Quantity</p>
              <div className="mt-2 flex items-center border border-cream-dark">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((n) => Math.max(1, n - 1))}
                  className="flex h-10 w-10 items-center justify-center text-brown hover:bg-cream"
                >
                  <MinusIcon />
                </button>
                <span className="w-8 text-center text-sm text-maroon">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((n) => n + 1)}
                  className="flex h-10 w-10 items-center justify-center text-brown hover:bg-cream"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              className="sm:flex-1"
              onClick={() => {
                addToCart(product, size, qty)
                setAdded(true)
              }}
            >
              Add to Cart
            </Button>
            <Button variant="outline" className="sm:flex-1">
              <HeartIcon width={16} height={16} /> Wishlist
            </Button>
          </div>

          {added && (
            <p className="mt-3 text-xs font-medium text-brown">
              Added to cart.{' '}
              <button type="button" onClick={() => navigate('/cart')} className="underline hover:text-maroon">
                View cart
              </button>
            </p>
          )}

          <dl className="mt-10 space-y-3 border-t border-cream-dark pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone">Fabric</dt>
              <dd className="text-brown">Pure silk blend</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">Work</dt>
              <dd className="text-brown">Zari &amp; thread embroidery</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">Care</dt>
              <dd className="text-brown">Dry clean only</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-center text-3xl text-maroon">You May Also Like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
