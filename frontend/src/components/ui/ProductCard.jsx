import { Link } from 'react-router-dom'
import Placeholder from './Placeholder'
import { HeartIcon } from '../icons/Icons'
import { toneFor } from '../../data/products'

export default function ProductCard({ product }) {
  // Local sample data uses `id`/`mrp`; the real API returns Mongo's `_id` and
  // `compareAtPrice` — support both so cards work with either source.
  const id = product.id || product._id
  const mrp = product.mrp ?? product.compareAtPrice
  const discount = mrp > product.price ? Math.round(100 - (product.price / mrp) * 100) : 0

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        {(product.images?.[0] || product.image) ? (
          <img
            src={product.images?.[0] || product.image}
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
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-none bg-ivory/90 text-brown opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 hover:bg-brown hover:text-ivory"
        >
          <HeartIcon width={15} height={15} />
        </button>
        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-ivory px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-brown">
            {discount}% off
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-col items-center space-y-1 text-center">
        <span className="text-[10px] uppercase tracking-widest text-brown-light">Saree</span>
        <h3 className="font-display text-lg text-brown transition-colors group-hover:text-maroon">
          {product.name}
        </h3>
        <p className="text-sm pt-1">
          <span className="font-medium text-brown">₹{product.price.toLocaleString('en-IN')}</span>{' '}
          {discount > 0 && (
            <span className="text-stone line-through">₹{mrp.toLocaleString('en-IN')}</span>
          )}
        </p>
      </div>
    </Link>
  )
}
