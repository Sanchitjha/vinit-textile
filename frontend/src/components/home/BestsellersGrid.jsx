import SareeCard from '../ui/SareeCard'
import Button from '../ui/Button'

export default function BestsellersGrid({ items, to }) {
  if (!items || items.length === 0) return null
  return (
    <section className="px-1 py-10 sm:px-2">
      <h2 className="mb-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-maroon sm:text-base">
        Bestsellers
      </h2>
      <div className="grid grid-cols-2 gap-x-1 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((product) => (
          <SareeCard key={product.id || product._id} product={product} bestseller />
        ))}
      </div>
      {to && (
        <div className="mt-10 text-center">
          <Button to={to} variant="outline">
            View All
          </Button>
        </div>
      )}
    </section>
  )
}
