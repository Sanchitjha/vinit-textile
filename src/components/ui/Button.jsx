import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'bg-brown text-ivory hover:bg-maroon',
  gold: 'bg-olive text-maroon hover:bg-brown hover:text-ivory',
  dark: 'bg-maroon text-ivory hover:bg-brown',
  outline: 'border border-brown text-brown hover:bg-brown hover:text-ivory',
  ghost: 'text-brown hover:text-maroon underline underline-offset-4',
}

export default function Button({
  to,
  href,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-200 ${VARIANTS[variant]} ${className}`

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
