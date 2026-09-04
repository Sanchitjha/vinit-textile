import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons'

// Each slide is a complete, pre-designed banner (title, discount, CTA all
// baked into the image itself) — so we just show the image full-bleed and
// make the whole thing a link, rather than layering our own text on top of
// text that's already there.
const slides = [
  { image: '/images/hero-1.webp', alt: 'The Festive Fashion Sale — flat 30-50% off sarees, lehengas and pure silk sarees', to: '/shop/saree' },
  { image: '/images/hero-2.webp', alt: 'The Festive Fashion Sale — flat 30-50% off pure silk sarees and lehengas', to: '/shop/saree' },
  { image: '/images/hero-3.webp', alt: 'Bestsellers — festive season popular picks, flat 30-50% off', to: '/shop/saree' },
  { image: '/images/hero-4.webp', alt: 'Pre Festive Drop — fresh festive arrivals', to: '/shop/saree' },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const slide = slides[active]

  const go = (direction) => {
    setActive((current) => (current + direction + slides.length) % slides.length)
  }

  return (
    <section id="home-hero" className="pb-12">
      <div className="relative overflow-hidden bg-cream">
        <Link to={slide.to} className="block">
          <img
            src={slide.image}
            alt={slide.alt}
            className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
          />
        </Link>

        {/* Tints the top of the banner so the transparent header (logo row +
            category nav row) floating on top of it stays readable, whatever
            the slide's own artwork looks like */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-maroon/85 via-maroon/45 to-transparent sm:h-44" />

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
