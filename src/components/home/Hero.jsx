import { useState } from 'react'
import Button from '../ui/Button'
import Placeholder from '../ui/Placeholder'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons'

const slides = [
  {
    eyebrow: 'Celebrate',
    title: 'Every Occasion With Ethnic Grace',
    label: 'Teal Banarasi silk saree with gold zari weave',
    tone: 'teal',
  },
  {
    eyebrow: 'New Season',
    title: 'Handwoven Sarees, Reimagined',
    label: 'New season handloom saree collection',
    tone: 'gold',
  },
  {
    eyebrow: 'Bridal Edit',
    title: 'Timeless Looks For Your Big Day',
    label: 'Maroon organza saree with gota embroidery',
    tone: 'maroon',
  },
]

export default function Hero() {
  const [active, setActive] = useState(0)
  const slide = slides[active]

  const go = (direction) => {
    setActive((current) => (current + direction + slides.length) % slides.length)
  }

  return (
    <section className="container-ambika pt-6">
      <div className="relative overflow-hidden">
        <Placeholder label={slide.label} tone={slide.tone} ratio="aspect-[16/9] sm:aspect-[21/9]" />

        <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/70 to-transparent sm:from-ivory/90 sm:via-ivory/30" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-lg px-6 sm:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-vermillion">
              {slide.eyebrow}
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight text-maroon sm:text-5xl">
              {slide.title}
            </h1>
            <div className="mt-6">
              <Button to="/shop/saree" variant="gold">
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
              key={item.title}
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
