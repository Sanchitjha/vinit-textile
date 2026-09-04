import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BagIcon, CloseIcon, HeartIcon, SearchIcon, UserIcon } from '../icons/Icons'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const menuLinks = [
  { label: 'Best Seller', to: '/shop/saree' },
  { label: 'Saree', to: '/shop/saree' },
  { label: 'Salwar Suits', to: '/shop/kurti' },
  { label: 'Lehenga', to: '/shop/lehenga' },
  { label: 'New Arrivals', to: '/shop/dress' },
  { label: 'Bridal', to: '/shop/lehenga' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()
  const { user, openAuthModal } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-40 bg-maroon">
      <div className="container-ambika flex items-center justify-between gap-4 py-3.5">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-5 text-ivory sm:gap-7">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors hover:text-gold"
          >
            {menuOpen ? (
              <CloseIcon />
            ) : (
              <span className="flex flex-col gap-[3px]">
                <span className="block h-0.5 w-4 bg-current" />
                <span className="block h-0.5 w-4 bg-current" />
                <span className="block h-0.5 w-4 bg-current" />
              </span>
            )}
            <span className="hidden sm:inline">Menu</span>
          </button>
          <button
            type="button"
            aria-label="Search"
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors hover:text-gold"
          >
            <SearchIcon />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Center: logo mark + wordmark */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/images/logo-mark.webp" alt="Vinit Textiles" className="h-9 w-auto sm:h-10" />
          <span className="hidden font-display text-xl tracking-[0.12em] text-ivory sm:inline sm:text-2xl">
            VINIT TEXTILES
          </span>
        </Link>

        {/* Right: wishlist, cart, account */}
        <div className="flex items-center gap-4 text-ivory sm:gap-5">
          <Link to="/account" aria-label="Wishlist" className="hidden transition-colors hover:text-gold sm:block">
            <HeartIcon />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative transition-colors hover:text-gold">
            <BagIcon />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-maroon">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <Link to="/account" aria-label="Account" className="transition-opacity hover:opacity-80">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[11px] font-semibold tracking-tight text-maroon">
                {initials}
              </div>
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Account"
              onClick={() => openAuthModal('login')}
              className="transition-colors hover:text-gold"
            >
              <UserIcon />
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gold/30 bg-ivory shadow-lg">
          <div className="container-ambika flex flex-col items-center gap-4 py-6 text-[11px] font-medium uppercase tracking-[0.2em] text-brown sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-4">
            {menuLinks.map((link) => (
              <NavLink
                key={`${link.to}-${link.label}`}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="transition-colors hover:text-maroon"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
