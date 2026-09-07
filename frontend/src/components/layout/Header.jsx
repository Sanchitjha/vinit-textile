import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BagIcon, CloseIcon, HeartIcon, SearchIcon, UserIcon } from '../icons/Icons'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import SearchOverlay from './SearchOverlay'

const menuLinks = [
  { label: 'Best Seller', to: '/shop/saree' },
  { label: 'Saree', to: '/shop/saree' },
  { label: 'Festival Special', to: '/shop/saree' },
  { label: 'New Arrivals', to: '/shop/dress' },
  { label: 'Bridal', to: '/shop/saree' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { count } = useCart()
  const { user, openAuthModal } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'

  // On the homepage the header floats transparent directly on the hero banner
  // (no separate bar) and turns into a solid maroon bar once the hero has
  // scrolled out of view. Other pages keep the plain solid bar throughout.
  const [overHero, setOverHero] = useState(isHome)

  useEffect(() => {
    if (!isHome) {
      setOverHero(false)
      return undefined
    }
    // Transparent while the top of the page (the hero) is still in view; solid
    // once scrolled past it. Recomputed on every scroll so it can never get
    // stuck, plus once after load since the hero's height grows when its image
    // finishes decoding.
    const compute = () => {
      const hero = document.getElementById('home-hero')
      const heroHeight = hero ? hero.offsetHeight : 400
      setOverHero(window.scrollY < heroHeight - 80)
    }
    compute()
    const settle = setTimeout(compute, 600)
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    window.addEventListener('load', compute)
    return () => {
      clearTimeout(settle)
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
      window.removeEventListener('load', compute)
    }
  }, [isHome])

  // Transparent while floating on the hero, but goes solid maroon the moment the
  // MENU or search row opens — so the row reads as a proper dark panel with
  // bold white text instead of faint text lost on a bright banner.
  const transparent = overHero && !menuOpen && !searchOpen

  // MENU and search are mutually exclusive — opening one closes the other.
  const toggleMenu = () => {
    setMenuOpen((open) => !open)
    setSearchOpen(false)
  }
  const toggleSearch = () => {
    setSearchOpen((open) => !open)
    setMenuOpen(false)
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <header
      className={`z-40 w-full transition-colors duration-300 ${isHome ? 'fixed top-0 left-0' : 'sticky top-0'} ${
        transparent ? 'bg-transparent [text-shadow:_0_1px_8px_rgb(0_0_0_/_70%)]' : 'bg-maroon'
      }`}
    >
      <div className="container-ambika flex items-center justify-between gap-4 py-3.5">
        {/* Left: Menu + Search (labels show on desktop, icons only on mobile) */}
        <div className="flex items-center gap-5 text-ivory sm:gap-7">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={toggleMenu}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-gold"
          >
            {menuOpen ? (
              <CloseIcon />
            ) : (
              <span className="flex flex-col gap-[3px]">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </span>
            )}
            <span className="hidden sm:inline">Menu</span>
          </button>
          <button
            type="button"
            aria-label="Toggle search"
            onClick={toggleSearch}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-gold"
          >
            {searchOpen ? <CloseIcon /> : <SearchIcon />}
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

      {/* Category menu dropdown — opens on MENU click. A proper floating
          dropdown card (rounded, bordered, shadowed) anchored under the MENU
          button, not just text flush against the header bar. */}
      {menuOpen && (
        <div className="container-ambika pt-1 pb-4">
          <div className="w-60 max-w-[80vw] rounded-2xl border border-gold/25 bg-maroon shadow-2xl">
            <div className="flex flex-col px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-cream">
              {menuLinks.map((link) => (
                <NavLink
                  key={`${link.to}-${link.label}`}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-ivory/10 py-2.5 transition-colors last:border-b-0 hover:text-gold"
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full-page search overlay */}
      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </header>
  )
}
