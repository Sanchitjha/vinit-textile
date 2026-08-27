import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BagIcon, CloseIcon, HeartIcon, SearchIcon, UserIcon } from '../icons/Icons'
import { useCart } from '../../context/CartContext'

const primaryLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const categoryLinks = [
  { label: 'Best Seller', to: '/shop/saree' },
  { label: 'Saree', to: '/shop/saree' },
  { label: 'Salwar Suits', to: '/shop/kurti' },
  { label: 'Lehenga', to: '/shop/lehenga' },
  { label: 'New Arrivals', to: '/shop/dress' },
  { label: 'Bridal', to: '/shop/lehenga' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-cream-dark bg-ivory/95 backdrop-blur">
      <div className="container-ambika flex items-center justify-between py-4">
        <button
          type="button"
          className="flex flex-col gap-1.5 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <CloseIcon />
          ) : (
            <>
              <span className="block h-0.5 w-6 bg-maroon" />
              <span className="block h-0.5 w-6 bg-maroon" />
              <span className="block h-0.5 w-4 bg-maroon" />
            </>
          )}
        </button>

        <nav className="hidden items-center gap-6 text-[11px] font-medium uppercase tracking-[0.2em] text-brown lg:flex">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="transition-colors hover:text-maroon">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/"
          className="font-display absolute left-1/2 -translate-x-1/2 text-xl tracking-[0.15em] text-brown sm:text-2xl lg:static lg:translate-x-0"
        >
          VINIT TEXTILES
        </Link>

        <div className="flex items-center gap-4 text-brown">
          <button type="button" aria-label="Search" className="hidden hover:text-maroon sm:block">
            <SearchIcon />
          </button>
          <Link to="/login" aria-label="Account" className="hover:text-maroon">
            <UserIcon />
          </Link>
          <Link to="/account" aria-label="Wishlist" className="hidden hover:text-maroon sm:block">
            <HeartIcon />
          </Link>
          <Link to="/cart" aria-label="Cart" className="relative hover:text-maroon">
            <BagIcon />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-maroon text-[10px] font-semibold text-ivory">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav
        className={`border-t border-cream-dark ${menuOpen ? 'block' : 'hidden'} lg:block`}
      >
        <div className="container-ambika flex flex-col items-center gap-4 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-brown-light lg:flex-row lg:justify-center lg:gap-10">
          {categoryLinks.map((link, index) => (
            <NavLink
              key={`${link.to}-${link.label}-${index}`}
              to={link.to}
              className="transition-colors hover:text-brown"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
