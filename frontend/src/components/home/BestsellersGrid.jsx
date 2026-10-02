import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BagIcon, HeartIcon } from '../icons/Icons'
import { useCart } from '../../context/CartContext'

function BestsellerCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const id = product.id || product._id
  const mrp = product.compareAtPrice ?? product.mrp
  const discount = mrp && mrp > product.price ? Math.round(100 - (product.price / mrp) * 100) : 0
  const rating = product.ratings > 0 ? product.ratings : 4.8

  return (
    <div className="group">
      <Link to={`/product/${id}`} className="relative block overflow-hidden bg-cream">
        <img
          src={product.images?.[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="aspect-[3/4.1] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 text-white drop-shadow"
        >
          <HeartIcon width={20} height={20} />
        </button>
        <span className="absolute bottom-2 left-0 rounded-r-md bg-gradient-to-r from-[#DFB347] via-[#E8C867] to-[#D4AF37] px-2.5 py-0.5 text-[9px] font-black uppercase italic tracking-wider text-[#3A1E14] shadow-md sm:text-[10px]">
          Bestseller
        </span>
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-white/95 px-2 py-0.5 text-[10px] font-bold text-gray-900 shadow-sm sm:text-[11px]">
          {rating.toFixed(1)} <span className="text-[10px] text-[#00897B]">★</span>
        </span>
      </Link>

      <div className="mt-2 flex items-start justify-between gap-2 px-1">
        <div className="min-w-0">
          <Link to={`/product/${id}`}>
            <h3 className="line-clamp-2 text-[13px] leading-snug text-brown sm:text-sm">{product.name}</h3>
          </Link>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-[12px] sm:text-[13px]">
            {discount > 0 && <span className="text-stone line-through">₹{mrp.toLocaleString('en-IN')}</span>}
            <span className="font-semibold text-brown">₹{product.price?.toLocaleString('en-IN')}</span>
            {discount > 0 && <span className="text-[10px] font-semibold uppercase text-[#E53935]">{discount}% off</span>}
          </p>
        </div>
        <button
          type="button"
          aria-label={added ? 'Added to bag' : 'Add to bag'}
          onClick={() => {
            addToCart(product, undefined, 1)
            setAdded(true)
            setTimeout(() => setAdded(false), 1500)
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E53935] text-white transition-colors hover:bg-[#C62828]"
        >
          {added ? <span className="text-sm font-bold">✓</span> : <BagIcon width={17} height={17} />}
        </button>
      </div>
    </div>
  )
}

export default function BestsellersGrid({ items }) {
  if (!items || items.length === 0) return null
  return (
    <section className="px-1 py-10 sm:px-2">
      <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-maroon sm:text-base">
        Bestsellers
      </h2>
      <div className="grid grid-cols-2 gap-x-1 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((product) => (
          <BestsellerCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </section>
  )
}
