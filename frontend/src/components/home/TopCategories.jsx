import { Link } from 'react-router-dom'

// All point to /shop/saree for now — the only category the backend has stock in.
const arches = [
  { label: 'SALE', to: '/shop/saree' },
  { label: 'Bestsellers / New arrivals', to: '/shop/saree' },
  { label: 'Partywear Collection', to: '/shop/saree' },
  { label: 'Wedding Edit', to: '/shop/saree' },
  { label: 'Everyday elegance / office wear', to: '/shop/saree' },
  { label: 'Pooja & Traditional', to: '/shop/saree' },
  { label: 'Bridal Edit', to: '/shop/saree' },
]

export default function TopCategories() {
  return (
    <section className="py-3 bg-cream-light/30">
      <div className="container-ambika overflow-x-auto scrollbar-hide">
        <div className="relative min-w-[850px] sm:min-w-0">
          <img
            src="/images/banner-sarees-collection.png?v=2"
            alt="Sarees — Timeless Elegance, Just For You"
            className="w-full h-auto object-contain block drop-shadow-xs"
          />
          {/* Clickable hotspot overlays for each of the 7 arches */}
          <div className="absolute inset-0 flex">
            {arches.map((arch, idx) => (
              <Link
                key={idx}
                to={arch.to}
                title={arch.label}
                aria-label={arch.label}
                className="w-[14.28%] h-full block cursor-pointer hover:bg-black/5 active:bg-black/10 transition-colors rounded-2xl"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
