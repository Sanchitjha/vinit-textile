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
    <section className="container-ambika py-10">
      <div className={`flex flex-col items-center gap-10 lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <div className="w-full lg:w-1/2">
          <Placeholder label={label} tone={tone} ratio="aspect-[4/3]" />
        </div>
        <div className="w-full lg:w-1/2">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-olive">{eyebrow}</p>
          )}
          <h2 className="font-display mt-3 text-3xl text-maroon">{title}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-brown/80">{description}</p>
          <div className="mt-6">
            <Button to={to} variant="outline">
              {cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
