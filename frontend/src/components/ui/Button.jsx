import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-maroon text-ivory hover:bg-brown',
  gold: 'bg-olive text-ivory hover:bg-brown',
  dark: 'bg-brown text-ivory hover:bg-maroon',
  outline: 'border border-brown text-brown hover:bg-brown hover:text-ivory',
  ghost: 'text-brown hover:text-maroon hover:underline underline-offset-4',
}

export default function Button({
  to,
  href,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 rounded-none ${VARIANTS[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
