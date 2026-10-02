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
import Seo from '../components/seo/Seo'
import { onlyRealProducts, uniqueDesigns, designKey } from '../utils/catalogue'
import { SITE_URL, absoluteUrl } from '../lib/seoConfig'

export default function ProductDetail() {
  const { id } = useParams() // id could be slug or actual id
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user, openAuthModal } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState([])
  const [categoryMeta, setCategoryMeta] = useState(null)

  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [variants, setVariants] = useState([])
  const [recent, setRecent] = useState([])
  const [pincode, setPincode] = useState('')
  const [deliveryMsg, setDeliveryMsg] = useState('')

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await apiClient.get(`/sarees/${id}`).catch(() => apiClient.get(`/sarees/slug/${id}`))
        const fetchedProduct = res.data
        setProduct(fetchedProduct)

        if (fetchedProduct) {
          const categoryId = fetchedProduct.category?._id || fetchedProduct.category?.id || fetchedProduct.category
          const [catRes, allRes] = await Promise.all([
            apiClient.get(`/categories/${categoryId}`),
            apiClient.get('/sarees?limit=100'),
          ]).catch(() => [{ data: null }, { data: { items: [] } }])
          setCategoryMeta(catRes.data)

          const all = onlyRealProducts(allRes.data?.items)
          const thisDesign = designKey(fetchedProduct)

          // Other colourways of this saree share its base SKU (VT-1499, VT-1499-BLUE, ...)
          const group = all.filter((p) => designKey(p) === thisDesign)
          setVariants(group.length > 1 ? group : [])

          // "You may also like": other designs only (never this saree or its colourways),
          // each design once — same category first, then the rest to fill four.
          const sameCategory = all.filter((p) => (p.category?._id || p.category) === categoryId)
          const skip = new Set([thisDesign])
          const first = uniqueDesigns(sameCategory, skip)
          first.forEach((p) => skip.add(designKey(p)))
          setRelated([...first, ...uniqueDesigns(all, skip)].slice(0, 4))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Remember the last few products viewed ("Previously Visited") — kept per browser.
  useEffect(() => {
    if (!product) return
    const pid = product.id || product._id
    try {
      const stored = JSON.parse(localStorage.getItem('vt_recent') || '[]')
      const others = uniqueDesigns(stored.filter((p) => p.id !== pid && designKey(p) !== designKey(product)))
      setRecent(others.slice(0, 4))
      const entry = {
        id: pid,
        name: product.name,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        images: (product.images || []).slice(0, 1),
        sku: product.sku,
      }
      localStorage.setItem('vt_recent', JSON.stringify([entry, ...others].slice(0, 8)))
    } catch {
      setRecent([])
    }
  }, [product])

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Seo title="Loading…" noindex />
        Loading...
      </div>
    )
  }

  if (!product) {
    return (
      <section className="container-ambika py-20 text-center">
        <Seo title="Product Not Found" description="This piece may have sold out or moved." noindex />
        <h1 className="font-display text-4xl text-brown">Product not found</h1>
        <p className="mt-4 text-sm text-brown-light">This piece may have sold out or moved.</p>
        <Link to="/shop/saree" className="mt-8 inline-block text-[11px] font-semibold uppercase tracking-widest text-brown hover:underline">
          Back to Saree collection
        </Link>
      </section>
    )
  }

  const detailRows = [
    ['Product Category', categoryMeta?.name],
    ['Fabric', product.fabric],
    ['Work', product.pattern],
    ['Colour', product.color],
    ['Weave', product.weave],
    ['Border', product.borderType],
    ['Occasion', (product.occasion || []).join(', ')],
    ['Material Care', product.careInstructions || 'Dry clean only'],
    ['Product Code', product.sku],
  ].filter(([, v]) => v)

  const discount = product.mrp ? Math.round(100 - (product.price / product.mrp) * 100) : 0

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: (product.images || []).map((img) => absoluteUrl(img)),
    sku: product.sku,
    description: `${product.name} — handcrafted saree from Vinit Textiles, finished with fine detailing for every celebration.`,
    brand: { '@type': 'Brand', name: 'Vinit Textiles' },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/product/${product.id || id}`),
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: categoryMeta?.name || 'Sarees', item: `${SITE_URL}/shop/${categoryMeta?.slug || ''}` },
      { '@type': 'ListItem', position: 3, name: product.name, item: absoluteUrl(`/product/${product.id || id}`) },
    ],
  }

  return (
    <section className="container-ambika py-16">
      <Seo
        title={product.name}
        description={`${product.name} — shop premium sarees at Vinit Textiles. ₹${product.price?.toLocaleString('en-IN')}. Direct from our Surat manufacturing hub.`}
        image={product.images?.[0] ? absoluteUrl(product.images[0]) : undefined}
        type="product"
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
      <nav className="text-[10px] uppercase tracking-[0.2em] text-brown-light">
        <Link to="/" className="hover:text-brown">
          HOME
        </Link>{' '}
        /{' '}
        <Link to={`/shop/${categoryMeta?.slug || ''}`} className="hover:text-brown">
          {categoryMeta?.name}
        </Link>{' '}
        / <span className="text-brown">{product.name}</span>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-start">
        {/* All photos stacked in a 2-column grid (like most saree stores) — each shown at its
            natural size so the whole photo, model's head included, is always visible. On phones
            it becomes a swipeable strip. */}
        {product.images && product.images.length > 0 ? (
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-2 sm:overflow-visible sm:px-0">
            {product.images.map((img, idx) => (
              <img
                key={img}
                src={img}
                alt={idx === 0 ? product.name : `${product.name} — photo ${idx + 1}`}
                loading={idx < 2 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : undefined}
                decoding="async"
                className="block h-auto w-[85%] shrink-0 snap-center self-start bg-ivory sm:w-full"
              />
            ))}
          </div>
        ) : (
          <Placeholder label={product.name} tone={toneFor(product.id)} ratio="aspect-[3/4] w-full" />
        )}

        <div className="lg:sticky lg:top-32 h-fit">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brown-light">
            {categoryMeta?.name}
          </p>
          <h1 className="font-display mt-4 text-4xl text-brown leading-tight">{product.name}</h1>

          <div className="mt-4 flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="text-brown" />
            ))}
            <span className="text-[11px] uppercase tracking-widest text-brown-light">({product.reviewCount || 0} REVIEWS)</span>
          </div>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-xl font-medium text-brown">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.mrp && (
              <span className="text-sm text-brown-light line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[10px] uppercase tracking-widest font-semibold text-brown">{discount}% off</span>
            )}
          </div>

          <div className="mt-10 flex items-center gap-6">
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

          {variants.length > 1 && (
            <div className="mt-10">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brown">Colours</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {variants.map((v) => {
                  const vid = v.id || v._id
                  const current = vid === (product.id || product._id)
                  return (
                    <Link
                      key={vid}
                      to={`/product/${vid}`}
                      title={v.name}
                      className={`block h-24 w-20 overflow-hidden border-2 transition-all ${
                        current ? 'border-brown' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={v.images?.[0]} alt={v.name} loading="lazy" className="h-full w-full object-cover" />
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              variant="dark"
              className="sm:flex-1"
              onClick={() => {
                addToCart(product, undefined, qty)
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
                addToCart(product, undefined, qty)
                setAdded(true)
              }}
            >
              ADD TO CART
            </Button>
          </div>

          <Button variant="outline" className="mt-4 w-full">
            <HeartIcon width={16} height={16} /> WISHLIST
          </Button>

          <div className="mt-10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brown">Delivery estimate</p>
            <form
              className="mt-3 flex items-center border border-brown/20"
              onSubmit={(e) => {
                e.preventDefault()
                setDeliveryMsg(
                  /^[1-9]\d{5}$/.test(pincode)
                    ? 'Dispatched in 24–48 hrs from Surat. Delivery in 3–4 days (metros) or 5–7 days (rest of India).'
                    : 'Please enter a valid 6-digit pincode.'
                )
              }}
            >
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                placeholder="Enter Pincode"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[13px] text-brown placeholder:text-brown-light focus:outline-none"
              />
              <button type="submit" className="px-4 text-[11px] font-semibold uppercase tracking-widest text-maroon hover:underline">
                Check delivery &gt;
              </button>
            </form>
            {deliveryMsg && <p className="mt-2 text-[12px] text-brown-light">{deliveryMsg}</p>}
          </div>

          <div className="mt-6 space-y-1 text-[11px] uppercase tracking-widest text-brown-light">
            <p>Cash on delivery available for orders up to ₹10,000</p>
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

          <div className="mt-12 border-t border-brown/10">
            <Accordion title="Details" defaultOpen>
              <p className="text-[13px] leading-relaxed text-brown-light">{product.description}</p>
              <p className="mt-3 text-[11px] leading-relaxed text-brown-light/80">
                Disclaimer: the blouse worn by the model may be for modelling purposes only — the saree comes with an
                unstitched blouse piece. Colour may vary slightly due to photographic lighting or your screen settings.
              </p>
              <p className="mt-5 text-[12px] font-semibold text-brown">Size &amp; Fit</p>
              <p className="text-[13px] text-brown-light">
                Saree: {product.sareeLength || 5.5} Mtrs; Blouse: {product.blouseLength || 0.8} Mtrs
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-[13px]">
                {detailRows.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[12px] font-semibold text-brown">{label}</dt>
                    <dd className="text-brown-light">{value}</dd>
                  </div>
                ))}
              </dl>
            </Accordion>

            <Accordion title="Offers">
              <ul className="space-y-3 text-[13px] text-brown-light">
                <li>
                  Use <strong className="text-maroon">WELCOME5</strong> — extra 5% off on your order
                </li>
                <li>
                  Use <strong className="text-maroon">VINIT10</strong> — extra 10% off
                </li>
                <li>
                  Use <strong className="text-maroon">FLASH5</strong> — extra 5% off on min. ₹2,490
                </li>
                <li>
                  Use <strong className="text-maroon">FESTIVE15</strong> — festival special, extra 15% off
                </li>
                <li>Free shipping on orders above ₹1,999</li>
              </ul>
            </Accordion>

            <Accordion title="Return Policy">
              <div className="space-y-3 text-[13px] leading-relaxed text-brown-light">
                <p>
                  <strong className="text-brown">7-day easy returns &amp; exchange.</strong> Raise a request within 7 days
                  of delivery — the saree must be unused, unwashed and in its original packaging with all tags intact.
                </p>
                <p>
                  Write to <a className="underline" href="mailto:vinittextiles21@gmail.com">vinittextiles21@gmail.com</a> or
                  WhatsApp +91 97126 39342 with your order ID and photos. We arrange a doorstep pickup where available.
                </p>
                <p>
                  Refunds: prepaid orders are credited to the original payment source in 3–5 working days after quality
                  check; COD orders by bank transfer in 5–7 working days.
                </p>
                <p>
                  <Link to="/returns-policy" className="underline">
                    Read the full returns policy
                  </Link>
                </p>
              </div>
            </Accordion>

            <Accordion title="Support">
              <ul className="space-y-2 text-[13px] text-brown-light">
                <li>Address: 8001-8004, The Rajhans Fabrizo Market, BRTS Road, Near Polaris Textile City, Magob, Surat, Gujarat 395012</li>
                <li>Call / WhatsApp: <strong className="text-brown">+91 97126 39342</strong> (Mon–Sat, 10 AM – 7:30 PM)</li>
                <li>Email: vinittextiles21@gmail.com</li>
                <li>
                  <Link to="/contact" className="underline">
                    Contact us
                  </Link>
                </li>
              </ul>
            </Accordion>
          </div>
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

      {recent.length > 0 && (
        <div className="mt-24">
          <h2 className="font-display text-center text-3xl text-brown">Previously Visited</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-4">
            {recent.map((item) => (
              <ProductCard key={item.id || item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-brown/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-brown"
      >
        {title}
        <span aria-hidden="true" className="text-lg font-light leading-none">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && <div className="pb-6">{children}</div>}
    </div>
  )
}
