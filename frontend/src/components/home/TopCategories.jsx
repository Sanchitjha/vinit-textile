import { Link } from 'react-router-dom'
import Placeholder from '../ui/Placeholder'
import { categories } from '../../data/products'

export default function TopCategories() {
  return (
    <section className="container-ambika py-20">
      <h2 className="font-display text-center text-4xl text-brown">Shop by Category</h2>
      <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.slug} to={`/shop/${category.slug}`} className="group text-center">
            <div className="overflow-hidden bg-cream">
              <Placeholder
                tone={category.tone}
                ratio="aspect-[3/4]"
                className="transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brown">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
