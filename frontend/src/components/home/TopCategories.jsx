import { Link } from 'react-router-dom'

// left/width are % of the collage image, measured from where each arch sits in it.
const arches = [
  { label: 'SALE', to: '/shop/saree', left: 2.99, width: 14.73 },
  { label: 'Bestsellers / New arrivals', to: '/shop/saree', left: 18.83, width: 14.78 },
  { label: 'Partywear Collection', to: '/shop/partywear', left: 34.71, width: 14.64 },
  { label: 'Wedding Edit', to: '/shop/saree', left: 50.51, width: 14.78 },
  { label: 'Pooja & Traditional', to: '/shop/silk-saree', left: 66.57, width: 14.78 },
  { label: 'Bridal', to: '/shop/bridal-saree', left: 82.46, width: 14.55 },
]

export default function TopCategories() {
  return (
    <section className="py-3 bg-cream-light/30">
      <div className="container-ambika overflow-x-auto scrollbar-hide">
        <div className="relative min-w-[850px] sm:min-w-0">
          <img
            src="/images/banner-sarees-collection.webp?v=4"
            alt="Sarees — Timeless Elegance, Just For You"
            className="w-full h-auto object-contain block drop-shadow-xs"
          />
          {/* Clickable hotspot over each of the 6 arches */}
          {arches.map((arch) => (
            <Link
              key={arch.label}
              to={arch.to}
              title={arch.label}
              aria-label={arch.label}
              style={{ left: `${arch.left}%`, width: `${arch.width}%` }}
              className="absolute top-0 block h-full cursor-pointer rounded-2xl transition-colors hover:bg-black/5 active:bg-black/10"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
