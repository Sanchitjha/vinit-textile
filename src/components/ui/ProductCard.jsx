import { Link } from 'react-router-dom'
import Placeholder from './Placeholder'
import { HeartIcon } from '../icons/Icons'
import { toneFor } from '../../data/products'

export default function ProductCard({ product }) {
  const discount = Math.round(100 - (product.price / product.mrp) * 100)

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative">
        <Placeholder label={product.name} tone={toneFor(product.id)} />
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(event) => event.preventDefault()}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ivory/90 text-brown shadow-sm transition-colors hover:bg-brown hover:text-ivory"
        >
          <HeartIcon width={15} height={15} />
        </button>
        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-vermillion px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-ivory">
            {discount}% off
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm text-maroon transition-colors group-hover:text-brown">
          {product.name}
        </h3>
        <p className="text-sm">
          <span className="font-semibold text-brown">₹{product.price.toLocaleString('en-IN')}</span>{' '}
          <span className="text-stone line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
        </p>
      </div>
    </Link>
  )
}
