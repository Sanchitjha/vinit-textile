import { Link } from 'react-router-dom'
import Placeholder from './Placeholder'
import { HeartIcon } from '../icons/Icons'
import { toneFor } from '../../data/products'

export default function ProductCard({ product }) {
  const id = product._id || product.id
  const mrp = product.mrp ?? product.compareAtPrice
  const discount = mrp && mrp > product.price
    ? Math.round(100 - (product.price / mrp) * 100)
    : 0

  const rawImage = product.images?.[0] || product.image
  const isBanner = typeof rawImage === 'string' && rawImage.includes('banner-')

  const portraitMap = {
    'VT-BAN-001': '/images/hero-1.webp',
    'VT-ORG-002': '/images/hero-2.webp',
    'VT-LIN-003': '/images/hero-3.webp',
    'VT-COT-004': '/images/hero-4.webp',
    'amb-saree-banarasi-teal': '/images/hero-1.webp',
    'amb-saree-organza-maroon': '/images/hero-2.webp',
    'amb-saree-linen-emerald': '/images/hero-3.webp',
    'amb-saree-cotton-yellow': '/images/hero-4.webp',
    'amb-lehenga-bridal-red': '/images/occasion-bridal.webp',
    'amb-lehenga-net-blush': '/images/occasion-wedding.webp',
    'amb-lehenga-festive-teal': '/images/occasion-diwali.webp',
    'amb-lehenga-classic-maroon': '/images/lookbook-1.webp',
    'amb-kurti-straight-mustard': '/images/occasion-festive-everyday.webp',
    'amb-kurti-anarkali-teal': '/images/lookbook-2.webp',
    'amb-kurti-printed-rose': '/images/lookbook-3.webp',
    'amb-kurti-palazzo-olive': '/images/split-ready-to-wear.webp',
  }

  const productImage = (!isBanner && rawImage)
    ? rawImage
    : (portraitMap[product.sku] || portraitMap[id] || '/images/hero-1.webp')

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="aspect-[3/4] w-full object-contain bg-ivory transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        ) : (
          <Placeholder
            label={product.name}
            tone={toneFor(id)}
            className="transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(event) => event.preventDefault()}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-none bg-ivory/90 text-brown opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 hover:bg-brown hover:text-ivory z-10"
        >
          <HeartIcon width={15} height={15} />
        </button>

        {/* Discount Tag Top-Left */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-ivory px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-brown z-10 shadow-xs">
            {discount}% off
          </span>
        )}

        {/* Bestseller Golden Ribbon Badge Bottom-Left */}
        {(product.isFeatured || product.isBestseller || (product.ratings && product.ratings >= 4.7)) && (
          <div className="absolute left-0 bottom-2 bg-gradient-to-r from-[#DFB347] via-[#E8C867] to-[#D4AF37] text-[#3A1E14] font-black italic text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-0.5 shadow-md rounded-r-md z-10">
            BESTSELLER
          </div>
        )}

        {/* Rating Pill Badge Bottom-Right */}
        <div className="absolute right-2 bottom-2 bg-white/95 text-gray-900 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 backdrop-blur-xs z-10">
          <span>{(product.ratings || 4.8).toFixed(1)}</span>
          <span className="text-[#00897B] text-[10px]">★</span>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center space-y-1 text-center">
        <span className="text-[10px] uppercase tracking-widest text-brown-light">Saree</span>
        <h3 className="font-display text-lg text-brown transition-colors group-hover:text-maroon">
          {product.name}
        </h3>
        <p className="text-sm pt-1">
          <span className="font-medium text-brown">₹{product.price?.toLocaleString('en-IN') ?? 0}</span>
          {discount > 0 && mrp && (
            <>
              {' '}
              <span className="text-stone line-through">₹{mrp.toLocaleString('en-IN')}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  )
}
