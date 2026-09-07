import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BagIcon, CloseIcon, HeartIcon, SearchIcon, UserIcon, MandalaMotifIcon } from '../icons/Icons'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import SearchOverlay from './SearchOverlay'

const SEARCH_PHRASES = [
  'Search Pure silk sarees',
  'Search Banarasi sarees',
  'Search Wedding collection',
  'Search Bridal sarees',
  'Search Ready to wear sarees',
  'Search Partywear sarees',
  'Search Festival special',
]

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
  const [placeholder, setPlaceholder] = useState('Search Pure silk sarees')
  const [showCursor, setShowCursor] = useState(true)
  const { count } = useCart()
  const { user, openAuthModal } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Typewriter effect
  useEffect(() => {
    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timeoutId

    const tick = () => {
      const phrase = SEARCH_PHRASES[phraseIndex]
      if (!deleting) {
        charIndex += 1
        setPlaceholder(phrase.slice(0, charIndex))
        if (charIndex === phrase.length) {
          deleting = true
          timeoutId = setTimeout(tick, 1800)
          return
        }
        timeoutId = setTimeout(tick, 75)
      } else {
        charIndex -= 1
        setPlaceholder(phrase.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % SEARCH_PHRASES.length
          timeoutId = setTimeout(tick, 400)
          return
        }
        timeoutId = setTimeout(tick, 35)
      }
    }

    timeoutId = setTimeout(tick, 400)
    return () => clearTimeout(timeoutId)
  }, [])

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setShowCursor((c) => !c), 530)
    return () => clearInterval(id)
  }, [])

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
        {/* Left: Menu */}
        <div className="flex items-center gap-4 text-ivory">
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
        </div>

        {/* Center: logo mark + wordmark */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/images/logo-mark.webp" alt="Vinit Textiles" className="h-9 w-auto sm:h-10" />
          <span className="font-display text-xl tracking-[0.12em] text-ivory sm:text-2xl">
            VINIT TEXTILES
          </span>
        </Link>

        {/* Center-Right: Desktop Search Pill */}
        <button
          type="button"
          aria-label="Open search"
          onClick={toggleSearch}
          className={`hidden sm:flex items-center gap-2.5 rounded-full px-4 py-2 text-xs transition-all shadow-xs max-w-xs md:max-w-sm w-full mx-2 ${
            transparent
              ? 'border border-white/90 bg-transparent text-white hover:bg-white/10'
              : 'border border-[#EBDCD5]/40 bg-transparent text-ivory hover:border-gold'
          }`}
        >
          <MandalaMotifIcon className="w-4 h-4 shrink-0 text-[#C44331]" />
          <span className="flex-1 text-left font-normal text-xs truncate">
            {placeholder}
            <span
              className={`inline-block w-[1.5px] h-3.5 bg-current ml-0.5 align-middle transition-opacity duration-100 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </span>
        </button>

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

      {/* Mobile Search Pill Row (Right under logo row) */}
      <div className="sm:hidden px-4 pb-3 pt-0">
        <button
          type="button"
          aria-label="Open search"
          onClick={toggleSearch}
          className={`w-full flex items-center gap-2.5 rounded-full px-4 py-2 text-xs transition-all shadow-xs ${
            transparent
              ? 'border border-white/90 bg-transparent text-white hover:bg-white/10'
              : 'border border-[#EBDCD5]/40 bg-transparent text-ivory hover:border-gold'
          }`}
        >
          <MandalaMotifIcon className="w-4 h-4 shrink-0 text-[#C44331]" />
          <span className="flex-1 text-left font-normal text-xs truncate">
            {placeholder}
            <span
              className={`inline-block w-[1.5px] h-3.5 bg-current ml-0.5 align-middle transition-opacity duration-100 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </span>
          <SearchIcon className="w-3.5 h-3.5 shrink-0 opacity-60" />
        </button>
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
