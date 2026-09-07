import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Placeholder from '../ui/Placeholder'

export default function Banner({
  eyebrow,
  title,
  accent,
  subtitle,
  cta = 'Shop Now',
  to = '/shop/saree',
  tone = 'brown',
  label,
  variant = 'light',
  align = 'center',
  // When set, the real (pre-designed, text-already-baked-in) banner image is
  // shown full-bleed instead of the placeholder + HTML text/CTA overlay —
  // the two are mutually exclusive so text never doubles up on top of image text.
  image,
  imageAlt,
}) {
  if (image) {
    return (
      <section className="py-6">
        <Link to={to} className="block overflow-hidden bg-cream">
          <img src={image} alt={imageAlt || title} className="w-full object-cover" />
        </Link>
      </section>
    )
  }


  const isDark = variant === 'dark'
  const textColor = isDark ? 'text-ivory' : 'text-maroon'
  const alignClass =
    align === 'left'
      ? 'items-start text-left'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-center text-center'
  // A scrim behind the text guarantees contrast regardless of which placeholder
  // tone is passed in — text can't safely assume the underlying gradient is light/dark.
  const scrimClass =
    align === 'left'
      ? isDark
        ? 'bg-gradient-to-r from-maroon/85 via-maroon/45 to-transparent'
        : 'bg-gradient-to-r from-ivory/90 via-ivory/55 to-transparent'
      : align === 'right'
        ? isDark
          ? 'bg-gradient-to-l from-maroon/85 via-maroon/45 to-transparent'
          : 'bg-gradient-to-l from-ivory/90 via-ivory/55 to-transparent'
        : isDark
          ? 'bg-maroon/55'
          : 'bg-ivory/75'

  return (
    <section className="container-ambika py-6">
      <div className="relative overflow-hidden bg-cream">
        <Placeholder label={label} tone={tone} ratio="aspect-[21/9] sm:aspect-[3/1]" />
        <div className={`absolute inset-0 ${scrimClass}`} />
        <div className={`absolute inset-0 flex flex-col justify-center gap-3 px-8 sm:px-16 ${alignClass}`}>
          {eyebrow && (
            <p className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${textColor} opacity-80`}>
              {eyebrow}
            </p>
          )}
          <h2 className={`font-display max-w-md text-3xl sm:text-5xl leading-tight ${textColor}`}>{title}</h2>
          {accent && (
            <p className="font-display max-w-md text-2xl italic text-gold sm:text-3xl">{accent}</p>
          )}
          {subtitle && (
            <p className={`max-w-sm text-xs font-semibold uppercase tracking-[0.2em] ${textColor} opacity-80`}>
              {subtitle}
            </p>
          )}
          <div className="mt-4">
            <Button to={to} variant={variant === 'dark' ? 'gold' : 'primary'}>
              {cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
