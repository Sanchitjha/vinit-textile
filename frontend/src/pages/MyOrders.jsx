import { Link } from 'react-router-dom'
import { ArrowLeft, PhoneCall, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import Seo from '../components/seo/Seo'
import OrdersList from '../components/orders/OrdersList'

export default function MyOrders() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-14 text-[#332421]">
      <Seo
        title="My Orders — Vinit Textiles"
        description="View and track all your Vinit Textiles saree orders, delivery status and invoices."
        noindex
      />

      <div className="container-ambika max-w-5xl mx-auto">
        {/* Breadcrumb / Top Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/me"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown hover:text-maroon transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Account
          </Link>

          <Link
            to="/track-order"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-maroon hover:underline"
          >
            <Truck size={14} />
            Quick Courier Tracking
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold-dark">
              <Sparkles size={13} className="text-gold" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
              Order History & Tracking
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-maroon mt-1">
            My Orders
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-brown-light max-w-xl">
            Review your purchase history, check real-time courier dispatch status, view receipts, and manage saree deliveries.
          </p>
        </div>

        {/* Main Orders List */}
        <OrdersList />

        {/* Help & Support Banner */}
        <div className="mt-12 rounded-2xl border border-brown/10 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-brown">
                  Order Assistance & Return Help
                </h3>
                <p className="mt-1 text-xs text-brown-light">
                  Have questions about blouse stitching, custom fall/pico, delivery timelines or need an exchange?
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 rounded-full border border-brown/20 px-4 py-2 text-xs font-semibold text-brown hover:bg-cream transition-colors"
              >
                <PhoneCall size={13} />
                Contact Care Desk
              </Link>
              <Link
                to="/returns-policy"
                className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-4 py-2 text-xs font-semibold text-ivory hover:bg-maroon/90 shadow-2xs transition-colors"
              >
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
