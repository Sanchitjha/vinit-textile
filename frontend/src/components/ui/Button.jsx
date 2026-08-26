import { Link } from 'react-router-dom'

const VARIANTS = {
<<<<<<< HEAD:src/components/ui/Button.jsx
  primary: 'bg-brown text-ivory hover:bg-maroon',
  gold: 'bg-gold text-maroon hover:bg-brown hover:text-ivory',
  dark: 'bg-maroon text-ivory hover:bg-brown',
=======
  primary: 'bg-maroon text-ivory hover:bg-brown',
  gold: 'bg-olive text-ivory hover:bg-brown',
  dark: 'bg-brown text-ivory hover:bg-maroon',
>>>>>>> 89fd1a727f8ef9ef6bfa757a8ed5db8dfb8edd8a:frontend/src/components/ui/Button.jsx
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
