import Button from '../ui/Button'
import ProductCard from '../ui/ProductCard'

export default function ProductGrid({ title, subtitle, items, to }) {
  return (
    <section className="container-ambika py-10">
      <div className="text-center">
        <h2 className="font-display text-3xl text-maroon">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-stone">{subtitle}</p>}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
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
