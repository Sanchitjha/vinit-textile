import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TruckIcon, ShieldCheckIcon, WhatsAppIcon } from '../components/icons/Icons'
import Seo from '../components/seo/Seo'

export default function TrackOrder() {
  const [orderQuery, setOrderQuery] = useState('')
  const [trackingData, setTrackingData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = (e) => {
    e.preventDefault()
    if (!orderQuery.trim()) {
      setError('Please enter your Order ID or Courier Tracking Number')
      return
    }
    setError('')
    setLoading(true)

    // Simulate real-time tracker
    setTimeout(() => {
      setLoading(false)
      setTrackingData({
        orderId: orderQuery.toUpperCase().startsWith('VT-') ? orderQuery.toUpperCase() : `VT-${orderQuery.toUpperCase()}`,
        carrier: 'Delhivery Express / Bluedart',
        awb: '98451278910',
        status: 'In Transit',
        origin: 'Surat Central Manufacturing Hub, Gujarat',
        destination: 'Customer Delivery Address',
        estimatedDelivery: 'Within 2–3 Days',
        steps: [
          { title: 'Order Confirmed', date: 'Yesterday, 11:30 AM', completed: true },
          { title: 'Handcrafted Quality Inspection & Packed', date: 'Yesterday, 04:15 PM', completed: true },
          { title: 'Dispatched from Surat Hub', date: 'Today, 09:45 AM', completed: true },
          { title: 'In Transit to Destination Hub', date: 'Today, 02:20 PM', completed: true, active: true },
          { title: 'Out for Delivery', date: 'Expected Tomorrow', completed: false },
          { title: 'Delivered to Doorstep', date: 'Estimated 2–3 Days', completed: false },
        ],
      })
    }, 600)
  }

  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <Seo title="Track Your Order" description="Track your Vinit Textiles saree order using your Order ID, AWB or mobile number." noindex />
      <div className="container-ambika max-w-3xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Live Courier Tracking</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-2">
            Enter your Order ID (e.g. VT-1049) or Mobile Number to check real-time package status.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label htmlFor="orderQuery" className="block text-xs font-bold uppercase tracking-wider text-[#4A1D1B] mb-1.5">
                Order ID / AWB / Mobile Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="orderQuery"
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="e.g. VT-1082 or 9876543210"
                  className="flex-1 rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-4 py-3 text-sm text-[#332421] placeholder:text-[#9F8A84] focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-sm bg-[#801B1A] px-7 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#681312] transition-colors disabled:opacity-50 shrink-0"
                >
                  {loading ? 'Locating...' : 'Track Package'}
                </button>
              </div>
              {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
            </div>
            <p className="text-[11px] text-[#8C7570]">
              *Order ID is sent via SMS and Email upon order confirmation. Example: VT-1001.
            </p>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs mb-8 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F0E6E0] pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C44331] bg-[#FFEAE5] px-2.5 py-1 rounded-full">
                  Status: {trackingData.status}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#4A1D1B] mt-2">
                  Order {trackingData.orderId}
                </h3>
                <p className="text-xs text-[#7A615C]">
                  Courier: <strong>{trackingData.carrier}</strong> | AWB: {trackingData.awb}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-[#8A726E]">Estimated Delivery</p>
                <p className="font-serif text-lg font-bold text-[#4A1D1B]">{trackingData.estimatedDelivery}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="py-8">
              <div className="relative border-l-2 border-[#EADFD8] ml-4 sm:ml-6 space-y-6">
                {trackingData.steps.map((step, idx) => (
                  <div key={idx} className="relative pl-6 sm:pl-8">
                    {/* Bullet */}
                    <div
                      className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                        step.completed
                          ? 'bg-[#1E7E34]'
                          : step.active
                          ? 'bg-[#C44331] ring-4 ring-[#FFEAE5]'
                          : 'bg-[#D9CCC5]'
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs sm:text-sm font-bold ${
                          step.active
                            ? 'text-[#C44331]'
                            : step.completed
                            ? 'text-[#1E7E34]'
                            : 'text-[#8A7570]'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-[#78615C] mt-0.5">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assistance Card */}
        <div className="bg-[#FFF4F0] rounded-xl border border-[#F5D5CE] p-6 text-center space-y-3">
          <h3 className="font-serif text-base font-bold text-[#4A1D1B]">
            Having Trouble Locating Your Order?
          </h3>
          <p className="text-xs text-[#735A55] max-w-md mx-auto">
            Our customer care team in Surat is available Monday to Saturday, 10 AM – 7 PM IST to assist you directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/919876543210?text=Hi%20Vinit%20Textiles,%20I%20need%20help%20tracking%20my%20order"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#20BA5A] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp Support
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-sm border border-[#801B1A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#801B1A] hover:bg-[#801B1A]/5 transition-colors"
            >
              Contact Helpdesk
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
