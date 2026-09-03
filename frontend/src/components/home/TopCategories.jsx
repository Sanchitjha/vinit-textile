import { Link } from 'react-router-dom'
import ArchFrame from '../ui/ArchFrame'
import Placeholder from '../ui/Placeholder'
import { sareeOccasions } from '../../data/products'

export default function TopCategories() {
  return (
    <section className="container-ambika py-10">
      <h2 className="font-display text-center text-4xl tracking-[0.15em] text-maroon">SAREES</h2>
      <p className="mt-2 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
        <span className="h-px w-8 bg-gold/60" />
        Timeless Elegance, Just For You
        <span className="h-px w-8 bg-gold/60" />
      </p>

      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {sareeOccasions.map((item) => (
          <Link key={item.slug} to={item.to} className="group text-center">
            <ArchFrame>
              <Placeholder
                tone={item.tone}
                ratio="aspect-[3/4]"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </ArchFrame>
            <p className="mt-3 text-xs font-medium uppercase leading-snug tracking-wide text-brown">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
