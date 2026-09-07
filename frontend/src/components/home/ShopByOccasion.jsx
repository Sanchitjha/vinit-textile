import { Link } from 'react-router-dom'
import ArchFrame from '../ui/ArchFrame'
import Placeholder from '../ui/Placeholder'
import Button from '../ui/Button'
import { occasions } from '../../data/products'

export default function ShopByOccasion() {
  return (
    <section className="bg-maroon py-8">
      <div className="container-ambika">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Curated For You
        </p>
        <h2 className="font-display mt-2 text-center text-3xl text-ivory">Shop By Occasion</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-cream/70">
          From wedding season to Diwali nights — find the edit made for your celebration.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {occasions.map((occasion) => (
            <Link key={occasion.slug} to={occasion.to} className="group text-center">
              <ArchFrame>
                {occasion.image ? (
                  <img
                    src={occasion.image}
                    alt={occasion.name}
                    className="aspect-[2/3] w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <Placeholder
                    tone={occasion.tone}
                    ratio="aspect-[2/3]"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </ArchFrame>
              <p className="mt-3 font-display text-base text-ivory">{occasion.name}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button to="/shop/saree" variant="gold">
            Explore All Collections
          </Button>
        </div>
      </div>
    </section>
  )
}
