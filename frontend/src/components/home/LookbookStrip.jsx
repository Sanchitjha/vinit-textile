import { Link } from 'react-router-dom'

const looks = [
  {
    image: '/images/lookbook-1.webp',
    alt: 'Ivory saree with hand-embroidered floral and animal motifs',
    title: 'Timeless Ivory',
    subtitle: 'Hand-embroidered floral elegance',
    to: '/shop/saree',
  },
  {
    image: '/images/lookbook-2.webp',
    alt: 'Purple silk saree with gold zari border at a palace courtyard',
    title: 'Royal Purple',
    subtitle: 'Gold zari silk grandeur',
    to: '/shop/saree',
  },
  {
    image: '/images/lookbook-3.webp',
    alt: 'Teal silk saree with mirror-work border',
    title: 'Teal Allure',
    subtitle: 'Mirror-work sophistication',
    to: '/shop/saree',
  },
]

export default function LookbookStrip() {
  return (
    <section className="py-10 bg-maroon/5">
      <div className="container-ambika">
        {/* Section heading */}
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Style Inspiration
          </p>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl text-brown">
            The Lookbook
          </h2>
          <div className="mx-auto mt-3 h-[1px] w-16 bg-gold/60" />
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {looks.map((look) => (
            <Link
              key={look.image}
              to={look.to}
              className="group relative block overflow-hidden"
            >
              {/* Gold border frame */}
              <div className="absolute inset-0 z-10 border-2 border-transparent group-hover:border-gold/50 transition-all duration-500 pointer-events-none" />

              {/* Image */}
              <div className="aspect-[3/4] w-full overflow-hidden bg-cream">
                <img
                  src={look.image}
                  alt={look.alt}
                  className="h-full w-full object-contain transition-transform duration-1000 ease-out group-hover:scale-110"
                />
              </div>

              {/* Bottom gradient overlay with text */}
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-maroon/80 via-maroon/40 to-transparent px-5 pb-5 pt-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <p className="font-display text-xl text-ivory">{look.title}</p>
                <p className="mt-1 text-xs tracking-wider text-cream/80 uppercase">{look.subtitle}</p>
              </div>

              {/* Corner accent — top-right gold triangle */}
              <div className="absolute -right-8 -top-8 z-10 h-16 w-16 rotate-45 bg-gold/20 group-hover:bg-gold/40 transition-colors duration-500" />

              {/* "View" label that appears on hover */}
              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="bg-ivory/90 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-brown shadow-lg backdrop-blur-sm">
                  View Look
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/shop/saree"
            className="inline-block border border-brown/30 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-brown transition-all duration-300 hover:bg-brown hover:text-ivory hover:border-brown"
          >
            View Full Lookbook
          </Link>
        </div>
      </div>
    </section>
  )
}
