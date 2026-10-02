import { Link } from 'react-router-dom'
import { ChevronRight, CircleHelp, FileText, Phone, Package, Ruler, ShieldCheck, Star, Store, Truck, Undo2, UserRound } from 'lucide-react'
import Seo from '../components/seo/Seo'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { icon: Package, title: 'Track Order', sub: 'Track your orders here', to: '/track-order' },
  { icon: Phone, title: 'Contact Us', sub: 'Get help and support', to: '/contact' },
  { icon: Ruler, title: 'Size Chart', sub: 'Saree & blouse measurements', to: '/size-chart' },
  { icon: Truck, title: 'Shipping & Delivery', sub: 'Delivery times and charges', to: '/shipping-delivery' },
  { icon: Star, title: 'Customer Reviews', sub: 'What our customers say', to: '/reviews' },
  { icon: CircleHelp, title: 'FAQ', sub: 'Frequently asked questions', to: '/faqs' },
  { icon: Store, title: 'Store Locator', sub: 'Visit our studio', to: '/stores' },
  { icon: FileText, title: 'Terms & Conditions', sub: 'Read our terms and conditions', to: '/terms-conditions' },
  { icon: ShieldCheck, title: 'Privacy Policy', sub: 'Our privacy and data policy', to: '/privacy-policy' },
  { icon: Undo2, title: 'Return Policy', sub: 'Our return policy', to: '/returns-policy' },
]

export default function AccountMenu() {
  const { user, openAuthModal, logout } = useAuth()
  const firstName = user?.name?.split(' ')[0]

  return (
    <div className="mx-auto max-w-xl pb-6">
      <Seo title="My Account" description="Your Vinit Textiles account, orders and help." noindex />

      <div className="bg-cream/60 px-5 pb-6 pt-8 text-center">
        <h1 className="font-display text-2xl text-brown">Welcome, {firstName || 'Guest'}!</h1>
        <p className="mt-2 text-sm text-brown-light">
          {user ? user.email : 'Login to access all features and track your orders'}
        </p>
        {user ? (
          <div className="mt-5 flex gap-3">
            <Link to="/account" className="flex-1 rounded-lg bg-maroon py-3.5 text-[13px] font-semibold uppercase tracking-widest text-ivory">
              My Account
            </Link>
            <button type="button" onClick={logout} className="rounded-lg border border-brown/30 px-5 text-[12px] font-semibold uppercase tracking-widest text-brown">
              Log out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={openAuthModal}
            className="mt-5 w-full rounded-lg bg-maroon py-3.5 text-[14px] font-semibold text-ivory transition-colors hover:bg-maroon/90"
          >
            Login Now
          </button>
        )}
      </div>

      <ul className="px-4">
        {user && (
          <li>
            <Link to="/account" className="flex items-center gap-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                <UserRound size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-brown">Orders &amp; Profile</span>
                <span className="block text-[12px] text-brown-light">Your orders, addresses and details</span>
              </span>
              <ChevronRight size={18} className="text-brown-light" />
            </Link>
          </li>
        )}
        {LINKS.map(({ icon: Icon, title, sub, to }) => (
          <li key={title}>
            <Link to={to} className="flex items-center gap-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                <Icon size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-brown">{title}</span>
                <span className="block text-[12px] text-brown-light">{sub}</span>
              </span>
              <ChevronRight size={18} className="text-brown-light" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
