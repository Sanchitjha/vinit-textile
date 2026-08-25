import Button from '../ui/Button'
import Placeholder from '../ui/Placeholder'

export default function Banner({
  eyebrow,
  title,
  subtitle,
  cta = 'Shop Now',
  to = '/shop/saree',
  tone = 'brown',
  label,
  variant = 'light',
  align = 'center',
}) {
  const textColor = variant === 'dark' ? 'text-ivory' : 'text-maroon'
  const alignClass = align === 'left' ? 'items-start text-left' : 'items-center text-center'

  return (
    <section className="container-ambika py-16">
      <div className="relative overflow-hidden bg-cream">
        <Placeholder label={label} tone={tone} ratio="aspect-[21/9] sm:aspect-[3/1]" />
        <div className={`absolute inset-0 flex flex-col justify-center gap-4 px-8 sm:px-16 ${alignClass}`}>
          {eyebrow && (
            <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${textColor} opacity-80`}>
              {eyebrow}
            </p>
          )}
          <h2 className={`font-display max-w-md text-3xl sm:text-5xl leading-tight ${textColor}`}>{title}</h2>
          {subtitle && <p className={`max-w-sm text-sm ${textColor} opacity-80`}>{subtitle}</p>}
          <div className="mt-4">
            <Button to={to} variant={variant === 'dark' ? 'primary' : 'dark'}>
              {cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
