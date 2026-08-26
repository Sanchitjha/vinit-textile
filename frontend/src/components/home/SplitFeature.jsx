import Button from '../ui/Button'
import Placeholder from '../ui/Placeholder'

export default function SplitFeature({
  eyebrow,
  title,
  description,
  cta = 'Show More',
  to = '/shop/saree',
  tone = 'cream',
  label,
  reverse = false,
}) {
  return (
    <section className="container-ambika py-20">
      <div className={`flex flex-col items-center gap-16 lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <div className="w-full lg:w-1/2 overflow-hidden bg-cream">
          <Placeholder label={label} tone={tone} ratio="aspect-[4/5] sm:aspect-[4/5] w-full" className="transition-transform duration-1000 hover:scale-105" />
        </div>
        <div className="w-full lg:w-1/2 lg:px-8">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brown-light">{eyebrow}</p>
          )}
          <h2 className="font-display mt-4 text-4xl text-brown sm:text-5xl leading-tight">{title}</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-brown-light">{description}</p>
          <div className="mt-10">
            <Button to={to} variant="outline">
              {cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
