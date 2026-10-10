import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/react'
import { Package, Truck, UserRound } from 'lucide-react'
import { BagIcon, CloseIcon, HeartIcon, SearchIcon, MandalaMotifIcon } from '../icons/Icons'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import SearchOverlay from './SearchOverlay'
import MenuDrawer from './MenuDrawer'

const SEARCH_PHRASES = [
  'Search Pure silk sarees',
  'Search Banarasi sarees',
  'Search Wedding collection',
  'Search Bridal sarees',
  'Search Ready to wear sarees',
  'Search Partywear sarees',
  'Search Festival special',
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [placeholder, setPlaceholder] = useState('Search Pure silk sarees')
  const [showCursor, setShowCursor] = useState(true)
  const { count } = useCart()
  const { user } = useAuth()
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
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleSearch = () => {
    setSearchOpen((open) => !open)
    setMenuOpen(false)
  }


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

        {/* Right: wishlist, cart, account auth controls */}
        <div className="flex items-center gap-2.5 text-ivory sm:gap-3.5">
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
          <Show when="signed-out">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-full px-2 sm:px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-ivory hover:text-gold transition-colors"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-gold px-3 sm:px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-maroon hover:bg-gold-light transition-colors shadow-xs"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/orders"
                aria-label="My Orders"
                className="hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-ivory hover:text-gold hover:bg-white/10 transition-all sm:flex"
                title="My Orders"
              >
                <Package size={17} />
                <span className="hidden md:inline">Orders</span>
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-7 h-7 ring-2 ring-gold/80 hover:ring-gold transition-all',
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Orders"
                    labelIcon={<Package size={15} />}
                    href="/orders"
                  />
                  <UserButton.Link
                    label="Track Order"
                    labelIcon={<Truck size={15} />}
                    href="/track-order"
                  />
                  <UserButton.Link
                    label="My Profile"
                    labelIcon={<UserRound size={15} />}
                    href="/account"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </Show>
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

      {/* Menu drawer — slides in from the left with image tiles by occasion / fabric / colour */}
      <MenuDrawer open={menuOpen} onClose={closeMenu} />

      {/* Full-page search overlay */}
      {searchOpen && (
        <SearchOverlay onClose={() => setSearchOpen(false)} />
      )}
    </header>
  )
}
