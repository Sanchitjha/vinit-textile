import { Link } from 'react-router-dom'
import { ChevronRight, CircleHelp, FileText, Phone, Package, Ruler, ShieldCheck, Star, Store, Truck, Undo2, UserRound } from 'lucide-react'
import Seo from '../components/seo/Seo'
import { useAuth } from '../context/AuthContext'

export default function AccountMenu() {
  const { user, openAuthModal, logout } = useAuth()
  const firstName = user?.name?.split(' ')[0]

  const links = [
    { icon: Package, title: 'Orders', sub: 'Track your orders here', to: user ? '/account' : '/track-order' },
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
          {user ? user.email : 'Login to access all features and track your orders'}
        </p>
        {user ? (
          <div className="mt-5 flex gap-3 md:flex-col">
            <Link to="/account" className="flex-1 rounded-lg bg-maroon py-3.5 text-[13px] font-semibold uppercase tracking-widest text-ivory md:py-3">
              My Account
            </Link>
            <button type="button" onClick={logout} className="rounded-lg border border-brown/30 px-5 py-3 text-[12px] font-semibold uppercase tracking-widest text-brown">
              Log out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="mt-5 w-full rounded-lg bg-maroon py-3.5 text-[14px] font-semibold text-ivory transition-colors hover:bg-maroon/90 md:py-3"
          >
            Login Now
          </button>
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
