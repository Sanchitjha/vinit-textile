import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SareeCard from '../ui/SareeCard'
import { uniqueDesigns } from '../../utils/catalogue'
import { loadCatalogue } from '../../utils/menuTiles'

function BagIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-44 w-44" aria-hidden="true">
      <ellipse cx="100" cy="182" rx="46" ry="6" fill="#000" opacity="0.12" />
      <g transform="rotate(14 100 100)">
        <path d="M62 62c0-44 76-44 76 0" fill="none" stroke="#D8D2CC" strokeWidth="7" strokeLinecap="round" />
        <path d="M54 62h92l8 108a8 8 0 0 1-8 8H54a8 8 0 0 1-8-8L54 62Z" fill="#6B1020" />
        <path d="M54 62h92l2 26H52l2-26Z" fill="#4A0B16" />
        <circle cx="100" cy="122" r="17" fill="#fff" opacity="0.92" />
        <path d="M92 124l6 6 11-14" fill="none" stroke="#6B1020" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

export default function EmptyCart() {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    let cancelled = false
    loadCatalogue().then((list) => {
      if (cancelled) return
      const byRating = [...list].sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
      setSuggestions(uniqueDesigns(byRating).slice(0, 8))
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-3 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <BagIllustration />
        <h1 className="mt-6 font-display text-2xl text-brown sm:text-3xl">Your shopping bag is empty!</h1>
        <p className="mt-2 text-sm text-brown-light">Explore the collection and find something you love.</p>
        <Link
          to="/shop/all"
          className="mx-auto mt-8 block max-w-md rounded-lg bg-maroon px-6 py-4 text-[13px] font-semibold uppercase tracking-widest text-ivory transition-colors hover:bg-maroon/90"
        >
          Start Shopping
        </Link>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-maroon">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {suggestions.map((p) => (
              <SareeCard key={p.id || p._id} product={p} bestseller={Boolean(p.isFeatured)} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
