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
  const isDark = variant === 'dark'
  const textColor = isDark ? 'text-ivory' : 'text-maroon'
  const alignClass = align === 'left' ? 'items-start text-left' : 'items-center text-center'
  // A scrim behind the text guarantees contrast regardless of which placeholder
  // tone is passed in — text can't safely assume the underlying gradient is light/dark.
  const scrimClass =
    align === 'left'
      ? isDark
        ? 'bg-gradient-to-r from-maroon/85 via-maroon/45 to-transparent'
        : 'bg-gradient-to-r from-ivory/90 via-ivory/55 to-transparent'
      : isDark
        ? 'bg-maroon/55'
        : 'bg-ivory/75'

  return (
    <section className="container-ambika py-10">
      <div className="relative overflow-hidden">
        <Placeholder label={label} tone={tone} ratio="aspect-[21/9] sm:aspect-[3/1]" />
        <div className={`absolute inset-0 ${scrimClass}`} />
        <div className={`absolute inset-0 flex flex-col justify-center gap-3 px-8 sm:px-16 ${alignClass}`}>
          {eyebrow && (
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${textColor} opacity-80`}>
              {eyebrow}
            </p>
          )}
          <h2 className={`font-display max-w-md text-3xl sm:text-4xl ${textColor}`}>{title}</h2>
          {subtitle && <p className={`max-w-sm text-sm ${textColor} opacity-80`}>{subtitle}</p>}
          <div className="mt-2">
            <Button to={to} variant={variant === 'dark' ? 'gold' : 'primary'}>
              {cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
