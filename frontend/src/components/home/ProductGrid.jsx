import Button from '../ui/Button'
import ProductCard from '../ui/ProductCard'

export default function ProductGrid({ title, subtitle, items, to }) {
  return (
    <section className="container-ambika pt-4 sm:pt-6 pb-10">
      <div className="text-center">
        <h2 className="font-display text-4xl text-brown">{title}</h2>
        {subtitle && <p className="mt-3 text-sm text-brown-light">{subtitle}</p>}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {to && (
        <div className="mt-16 text-center">
          <Button to={to} variant="outline">
            View All
          </Button>
        </div>
      )}
    </section>
  )
}
