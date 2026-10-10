import { Link } from 'react-router-dom'
import { SignInButton, SignUpButton } from '@clerk/react'
import { ChevronRight, CircleHelp, FileText, Phone, Package, Ruler, ShieldCheck, Star, Store, Truck, Undo2, UserRound } from 'lucide-react'
import Seo from '../components/seo/Seo'
import { useAuth } from '../context/AuthContext'

export default function AccountMenu() {
  const { user, isCustomerLoggedIn, openAuthModal, logout } = useAuth()
  const firstName = isCustomerLoggedIn ? (user?.name?.split(' ')[0] || 'Customer') : null

  const links = [
    ...(isCustomerLoggedIn ? [{ icon: Package, title: 'My Orders', sub: 'Track orders, delivery status & invoices', to: '/orders' }] : []),
    { icon: Phone, title: 'Contact Us', sub: 'Get help and support', to: '/contact' },
    { icon: Ruler, title: 'Size Chart', sub: 'Saree & blouse measurements', to: '/size-chart' },
    { icon: CircleHelp, title: 'FAQ', sub: 'Frequently asked questions', to: '/faqs' },
    { icon: Truck, title: 'Shipping & Delivery', sub: 'Delivery times and charges', to: '/shipping-delivery' },
    { icon: Store, title: 'Store Locator', sub: 'Visit our studio', to: '/stores' },
    { icon: Star, title: 'Customer Reviews', sub: 'What our customers say', to: '/reviews' },
    { icon: FileText, title: 'Terms & Conditions', sub: 'Read our terms and conditions', to: '/terms-conditions' },
    { icon: ShieldCheck, title: 'Privacy Policy', sub: 'Our privacy and data policy', to: '/privacy-policy' },
    { icon: Undo2, title: 'Return Policy', sub: 'Our return policy', to: '/returns-policy' },
  ]

  return (
    <div className="mx-auto max-w-5xl pb-6 md:flex md:items-start md:gap-8 md:px-6 md:py-14">
      <Seo title="My Account" description="Your Vinit Textiles account, orders and help." noindex />

      <div className="bg-cream/60 px-5 pb-6 pt-8 text-center md:w-72 md:shrink-0 md:rounded-2xl md:border md:border-brown/10 md:px-6 md:py-9">
        <span className="mx-auto mb-4 hidden h-16 w-16 items-center justify-center rounded-full bg-maroon/10 text-maroon md:flex">
          <UserRound size={28} />
        </span>
        <h1 className="font-display text-2xl text-brown md:text-xl">Welcome, {firstName || 'Guest'}!</h1>
        <p className="mt-2 text-sm text-brown-light md:text-[13px]">
          {isCustomerLoggedIn ? user?.email : 'Login to access all features and track your orders'}
        </p>
        {isCustomerLoggedIn ? (
          <div className="mt-5 flex flex-col gap-2.5">
            <Link to="/orders" className="w-full rounded-lg bg-maroon py-3 text-[13px] font-semibold uppercase tracking-wider text-ivory shadow-xs hover:bg-maroon/90 transition-colors">
              My Orders
            </Link>
            <Link to="/account" className="w-full rounded-lg border border-brown/30 bg-white py-2.5 text-[12px] font-semibold uppercase tracking-wider text-brown hover:bg-cream transition-colors">
              Profile & Addresses
            </Link>
            <button type="button" onClick={logout} className="w-full rounded-lg border border-rose-200 py-2 text-[12px] font-semibold uppercase tracking-wider text-rose-700 hover:bg-rose-50 transition-colors">
              Log out
            </button>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-2.5">
            <SignInButton mode="modal">
              <button
                type="button"
                className="w-full rounded-lg bg-maroon py-3 text-[13px] font-semibold uppercase tracking-wider text-ivory transition-colors hover:bg-maroon/90 cursor-pointer shadow-xs"
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="w-full rounded-lg bg-gold py-2.5 text-[13px] font-bold uppercase tracking-wider text-maroon transition-colors hover:bg-gold-light cursor-pointer shadow-xs"
              >
                Create Account (Sign Up)
              </button>
            </SignUpButton>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="hidden md:block">
          <h2 className="font-display text-2xl text-brown">My Account</h2>
          <p className="mt-1 text-[13px] text-brown-light">Manage your orders, preferences, and more</p>
        </div>
        <ul className="px-4 md:mt-6 md:grid md:grid-cols-2 md:gap-3 md:px-0">
          {links.map(({ icon: Icon, title, sub, to }) => (
            <li key={title}>
              <Link
                to={to}
                className="flex items-center gap-4 py-4 md:rounded-xl md:border md:border-brown/10 md:bg-white md:px-4 md:py-3.5 md:shadow-sm md:transition-shadow md:hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-brown md:text-sm">{title}</span>
                  <span className="block text-[12px] text-brown-light md:text-[11px]">{sub}</span>
                </span>
                <ChevronRight size={18} className="text-brown-light" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
