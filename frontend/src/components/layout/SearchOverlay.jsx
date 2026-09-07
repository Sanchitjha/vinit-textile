import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CloseIcon, SearchIcon } from '../icons/Icons'
import { apiClient } from '../../api/client'

// Typing placeholder phrases
const PLACEHOLDER_PHRASES = [
  'Search Sarees',
  'Search Silk Sarees',
  'Search Wedding Collection',
  'Search Bridal Sarees',
  'Search Festival Special',
]

// Top search tags — these are our categories
const TOP_SEARCHES = [
  { label: 'Saree', to: '/shop/saree' },
  { label: 'Silk Saree', to: '/shop/saree' },
  { label: 'Partywear', to: '/shop/saree' },
  { label: 'Wedding Collection', to: '/shop/saree' },
  { label: 'Bridal Saree', to: '/shop/saree' },
  { label: 'Festival Special', to: '/shop/saree' },
  { label: 'Banarasi Saree', to: '/shop/saree' },
  { label: 'New Arrivals', to: '/shop/dress' },
]

export default function SearchOverlay({ onClose }) {
  const [value, setValue] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Fetch recommended products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await apiClient.get('/sarees?limit=8&sort=newest')
        setProducts(res.data?.items || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchProducts()
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (value) return undefined
    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timeoutId

    const tick = () => {
      const phrase = PLACEHOLDER_PHRASES[phraseIndex]
      if (!deleting) {
        charIndex += 1
        setPlaceholder(phrase.slice(0, charIndex))
        if (charIndex === phrase.length) {
          deleting = true
          timeoutId = setTimeout(tick, 1400)
          return
        }
        timeoutId = setTimeout(tick, 70)
      } else {
        charIndex -= 1
        setPlaceholder(phrase.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % PLACEHOLDER_PHRASES.length
          timeoutId = setTimeout(tick, 400)
          return
        }
        timeoutId = setTimeout(tick, 35)
      }
    }

    timeoutId = setTimeout(tick, 300)
    return () => clearTimeout(timeoutId)
  }, [value])

  // Blinking cursor
  useEffect(() => {
    if (value) return undefined
    const id = setInterval(() => setShowCursor((c) => !c), 530)
    return () => clearInterval(id)
  }, [value])

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const submit = (event) => {
    event.preventDefault()
    const q = value.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    onClose()
  }

  const handleTagClick = (tag) => {
    navigate(tag.to)
    onClose()
  }

  const discount = (product) => {
    const mrp = product.mrp ?? product.compareAtPrice
    return mrp > product.price ? Math.round(100 - (product.price / mrp) * 100) : 0
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ivory animate-[fadeIn_0.2s_ease-out]">
      {/* Search bar header */}
      <div className="border-b border-cream-dark bg-white shadow-sm">
        <div className="container-ambika flex items-center gap-4 py-3">
          <SearchIcon className="w-5 h-5 text-brown-light shrink-0" />
          <form onSubmit={submit} className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder=""
              aria-label="Search products"
              className="w-full bg-transparent text-lg text-brown outline-none font-body"
            />
            {/* Typing animation */}
            {!value && (
              <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-lg text-brown-light/60">
                {placeholder}
                <span
                  className={`inline-block w-[2px] h-5 bg-gold ml-[1px] align-middle transition-opacity duration-100 ${
                    showCursor ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </span>
            )}
          </form>
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center text-brown-light transition-colors hover:text-brown"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
        <div className="container-ambika py-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            {/* Left: Top Searches */}
            <div className="lg:w-1/4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brown mb-5">
                Top Searches
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {TOP_SEARCHES.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="rounded-full border border-brown/20 px-4 py-2 text-xs font-medium text-brown transition-all duration-200 hover:bg-brown hover:text-ivory hover:border-brown active:scale-95"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Recommended Products */}
            <div className="lg:w-3/4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-brown mb-5">
                Recommended For You
              </h3>
              {products.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => {
                    const id = product.id || product._id
                    const mrp = product.mrp ?? product.compareAtPrice
                    const disc = discount(product)
                    const image = product.images?.[0] || product.image
                    return (
                      <Link
                        key={id}
                        to={`/product/${id}`}
                        onClick={onClose}
                        className="group block"
                      >
                        <div className="relative overflow-hidden bg-cream aspect-[3/4]">
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream to-cream-dark">
                              <span className="font-display text-xs italic text-brown-light/40 px-2 text-center">{product.name}</span>
                            </div>
                          )}
                          {disc > 0 && (
                            <span className="absolute left-2 top-2 bg-vermillion text-white px-1.5 py-0.5 text-[9px] font-bold rounded">
                              {disc}% OFF
                            </span>
                          )}
                        </div>
                        <div className="mt-2.5">
                          <p className="text-xs text-brown font-medium leading-tight line-clamp-2 group-hover:text-maroon transition-colors">
                            {product.name}
                          </p>
                          <p className="mt-1 text-xs">
                            <span className="font-semibold text-brown">₹{product.price?.toLocaleString('en-IN')}</span>
                            {disc > 0 && (
                              <>
                                {' '}
                                <span className="text-stone line-through text-[10px]">₹{mrp?.toLocaleString('en-IN')}</span>
                                {' '}
                                <span className="text-vermillion font-semibold text-[10px]">{disc}% OFF</span>
                              </>
                            )}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-cream-dark/40 rounded" />
                      <div className="mt-2 h-3 w-3/4 bg-cream-dark/40 rounded" />
                      <div className="mt-1 h-3 w-1/2 bg-cream-dark/40 rounded" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
