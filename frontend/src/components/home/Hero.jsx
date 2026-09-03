import { useState } from 'react'
import Button from '../ui/Button'
import Placeholder from '../ui/Placeholder'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons'

const slides = [
  {
    eyebrow: 'New Arrivals',
    title: 'Pre Festive Drop',
    subtitle: 'Fresh Festive Arrivals',
    to: '/shop/saree',
    label: 'Three women in purple saree, mint sharara and red lehenga at a festive courtyard',
    tone: 'maroon',
  },
  {
    eyebrow: 'Bestsellers',
    title: 'Festive Season Popular Picks',
    subtitle: 'Flat 30% – 50% Off · Pure Silk Sarees · Lehengas',
    to: '/shop/saree',
    label: 'Two women in yellow kurta and teal silk saree at a festive setting',
    tone: 'gold',
  },
  {
    eyebrow: 'The Festive Fashion Sale',
    title: 'Flat 30% – 50% Off',
    subtitle: 'Pure Silk Sarees · Lehengas',
    to: '/shop/saree',
    label: 'Two women in cream floral and maroon sarees in a mirrored hall',
    tone: 'brown',
  },
  {
    eyebrow: 'The Festive Fashion Sale',
    title: 'Flat 30% – 50% Off',
    subtitle: 'Sarees · Lehengas · Pure Silk Sarees',
    to: '/shop/saree',
    label: 'Three women getting ready in mustard, silver and cream sarees',
    tone: 'teal',
  },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const slide = slides[active]

  const go = (direction) => {
    setActive((current) => (current + direction + slides.length) % slides.length)
  }

  return (
    <section className="container-ambika pt-4 pb-12">
      <div className="relative overflow-hidden bg-cream">
        <Placeholder label={slide.label} tone={slide.tone} ratio="aspect-[16/9] sm:aspect-[21/9]" />

        <div className="absolute inset-0 bg-gradient-to-r from-ivory/90 via-ivory/50 to-transparent sm:from-ivory/80 sm:via-ivory/20" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-lg px-6 sm:px-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-vermillion">
              {slide.eyebrow}
            </p>
            <h1 className="font-display mt-4 text-4xl leading-tight text-maroon sm:text-6xl">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-3 text-sm font-medium tracking-wide text-brown sm:text-base">
                {slide.subtitle}
              </p>
            )}
            <div className="mt-8">
              <Button to={slide.to || '/shop/saree'} variant="gold">
                Shop Now
              </Button>
            </div>
          </div>
        </div>

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
              key={`${item.title}-${index}`}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === active ? 'w-6 bg-brown' : 'w-1.5 bg-brown/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
