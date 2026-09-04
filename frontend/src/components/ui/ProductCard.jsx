import { Link } from 'react-router-dom'
import Placeholder from './Placeholder'
import { HeartIcon } from '../icons/Icons'
import { toneFor } from '../../data/products'

export default function ProductCard({ product }) {
  const discount = product.mrp && product.mrp > product.price 
    ? Math.round(100 - (product.price / product.mrp) * 100) 
    : 0
  
  const productId = product._id || product.id

  return (
    <Link to={`/product/${productId}`} className="group block">
      <div className="relative overflow-hidden bg-cream">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        ) : (
          <Placeholder 
            label={product.name} 
            tone={toneFor(productId)} 
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
          <span className="font-medium text-brown">₹{product.price?.toLocaleString('en-IN') ?? 0}</span>
          {product.mrp && (
            <>
              {' '}
              <span className="text-stone line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  )
}
