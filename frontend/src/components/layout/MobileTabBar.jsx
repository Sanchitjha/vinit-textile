import { Link, useLocation } from 'react-router-dom'
import { House, LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { shopLink } from '../../utils/menuTiles'

// Floating bottom navigation for phones: Home · Category · Bestsellers (logo) · Bag · Account.
export default function MobileTabBar() {
  const { pathname } = useLocation()
  const { count } = useCart()

  const is = (...paths) => paths.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)))
  const tab = (active) => `flex h-11 w-11 items-center justify-center rounded-full transition-colors ${active ? 'text-maroon' : 'text-brown-light'}`

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-between rounded-full bg-white px-3 py-1.5 shadow-[0_6px_28px_rgba(0,0,0,0.2)] md:hidden"
    >
      <Link to="/" aria-label="Home" className={tab(is('/'))}>
        <House size={23} strokeWidth={is('/') ? 2.4 : 1.8} />
      </Link>
      <Link to="/categories" aria-label="Category" className={tab(is('/categories'))}>
        <LayoutGrid size={23} strokeWidth={is('/categories') ? 2.4 : 1.8} />
      </Link>
      <Link to={shopLink({ sort: 'rating' })} aria-label="Bestsellers" className="flex h-11 w-11 items-center justify-center">
        <img src="/images/logo-mark.webp" alt="" className="h-8 w-8 object-contain" />
      </Link>
      <Link to="/cart" aria-label="Bag" className={`relative ${tab(is('/cart'))}`}>
        <ShoppingBag size={23} strokeWidth={is('/cart') ? 2.4 : 1.8} />
        {count > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-maroon px-1 text-[9px] font-bold text-ivory">
            {count}
          </span>
        )}
      </Link>
      <Link to="/me" aria-label="Account" className={tab(is('/me', '/account', '/login', '/signup'))}>
        <User size={23} strokeWidth={is('/me', '/account', '/login', '/signup') ? 2.4 : 1.8} />
      </Link>
    </nav>
  )
}
