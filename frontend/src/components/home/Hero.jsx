import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons'

// How long each slide stays before auto-advancing (ms).
const AUTOPLAY_MS = 1000

// Each slide is a complete, pre-designed banner (title, discount, CTA all
// baked into the image itself) — so we just show the image full-bleed and
// make the whole thing a link, rather than layering our own text on top of
// text that's already there.
// hero-3 (the "Bestsellers" shot) is a near-square 3:2 image, much taller than
// the others; it can't be shortened to match without cropping into the models'
// faces, so it's left out of the rotation until a wide version is available.
const slides = [
  { image: '/images/hero-1.webp', alt: 'The Festive Fashion Sale — flat 30-50% off sarees, lehengas and pure silk sarees', to: '/shop/saree' },
  { image: '/images/hero-2.webp', alt: 'The Festive Fashion Sale — flat 30-50% off pure silk sarees and lehengas', to: '/shop/saree' },
  { image: '/images/hero-4.webp', alt: 'Pre Festive Drop — fresh festive arrivals', to: '/shop/saree' },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  // Guard against `active` ever pointing past the array (e.g. if the slide count
  // changes) so we never read `.to`/`.image` off undefined.
  const slide = slides[active] || slides[0]

  const go = (direction) => {
    setActive((current) => (current + direction + slides.length) % slides.length)
  }

  // Preload all slide images once so the fast auto-rotation never flashes a
  // blank/half-loaded frame the first time each slide comes around.
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image()
      img.src = s.image
    })
  }, [])

  // Auto-advance to the next slide on a timer, on both desktop and mobile.
  // Keyed on `active` so a manual dot/arrow tap restarts the countdown
  // instead of jumping again immediately after.
  useEffect(() => {
    const id = setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [active])

  return (
    <section id="home-hero" className="pb-12">
      <div className="relative overflow-hidden bg-cream">
        <Link to={slide.to} className="block">
          {/* Mobile: full natural image (whole wide banner, nothing cropped).
              Desktop (sm+): fixed 90vh height so the hero stays compact and the
              next section peeks; object-cover + object-bottom trims only the
              empty ceiling/headroom from the TOP, keeping the models and the
              SHOP NOW button in view. A definite height (not h-auto+object-cover,
              which can collapse to 0) is what makes this render reliably. */}
          <img
            src={slide.image}
            alt={slide.alt}
            className="block h-auto w-full sm:h-[90vh] sm:object-cover sm:object-bottom"
          />
        </Link>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(-1)}
          className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/80 text-brown hover:bg-ivory sm:flex"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(1)}
          className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/80 text-brown hover:bg-ivory sm:flex"
        >
          <ChevronRightIcon />
        </button>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((item, index) => (
            <button
              key={item.image}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-6 bg-ivory' : 'w-1.5 bg-ivory/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
