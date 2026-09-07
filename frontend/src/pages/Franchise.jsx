import { useState } from 'react'
import { WhatsAppIcon, SparkleIcon, ShieldCheckIcon, TruckIcon } from '../components/icons/Icons'

export default function Franchise() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    businessType: 'Boutique Owner',
    investment: '₹2 Lakh - ₹5 Lakh',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <div className="container-ambika max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Business Collaboration</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A1D1B] mt-2">
            Own A Franchise & Wholesale Partnership
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-3 max-w-2xl mx-auto">
            Bring Surat's premier manufacturer-rate sarees to your city. Partner directly with Vinit Pandey, Nitish Pandey, and Sowmya Mishra for unmatched margins and artisanal collections.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FFEFEA] flex items-center justify-center text-[#C44331] font-bold text-base mb-3">
              %
            </div>
            <h3 className="font-serif font-bold text-base text-[#4A1D1B]">35%–60% Profit Margins</h3>
            <p className="text-xs text-[#735B57] mt-1.5 leading-relaxed">
              Direct factory pricing with no middle wholesalers or distributors, giving you superior retail profitability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FFEFEA] flex items-center justify-center text-[#C44331] mb-3">
              <SparkleIcon className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#4A1D1B]">Exclusive Designs</h3>
            <p className="text-xs text-[#735B57] mt-1.5 leading-relaxed">
              Access to new weekly releases, festive edits, and bridal catalogues curated by Sowmya Mishra before public launch.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FFEFEA] flex items-center justify-center text-[#C44331] mb-3">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#4A1D1B]">Zero Royalty Model</h3>
            <p className="text-xs text-[#735B57] mt-1.5 leading-relaxed">
              Transparent, straightforward partnership. No recurring royalties or hidden franchise fees. You retain 100% of your retail earnings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FFEFEA] flex items-center justify-center text-[#C44331] mb-3">
              <TruckIcon className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#4A1D1B]">Priority Logistics</h3>
            <p className="text-xs text-[#735B57] mt-1.5 leading-relaxed">
              Fast, insured surface and express air cargo dispatch directly from our Surat manufacturing center to your shop.
            </p>
          </div>
        </div>

        {/* Application Form + Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-10 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#EAF7ED] text-[#1E7E34] flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#4A1D1B]">Partnership Request Received!</h3>
                <p className="text-xs sm:text-sm text-[#6C5551] max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Nitish Pandey or a member of our partnership desk will call you within 24 business hours to discuss catalogs, price sheets, and sample dispatch.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="rounded-sm bg-[#801B1A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#681312] transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#4A1D1B] mb-2">
                  Franchise & Wholesale Inquiry Form
                </h2>
                <p className="text-xs text-[#7A615C] mb-4">
                  Please fill in your business details. Our founders will review and connect with you directly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      City & State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Lucknow, UP"
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      Business Profile
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    >
                      <option>Boutique Owner</option>
                      <option>Retail Saree Showroom</option>
                      <option>Wholesale Distributor</option>
                      <option>Aspiring Franchisee / New Store</option>
                      <option>Online Reseller / Influencer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      Planned Sourcing Budget
                    </label>
                    <select
                      value={formData.investment}
                      onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    >
                      <option>₹50,000 - ₹2 Lakh (Starter Batch)</option>
                      <option>₹2 Lakh - ₹5 Lakh</option>
                      <option>₹5 Lakh - ₹15 Lakh</option>
                      <option>₹15 Lakh+ (Exclusive City Franchise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                    Your Requirements / Message
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your store location, customer preferences, or sample catalog requests..."
                    className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-sm bg-[#801B1A] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#681312] transition-colors shadow-xs"
                >
                  Submit Partnership Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Quick Connect & Direct Founders Desk */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#4A1D1B] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Direct Founder Line</span>
              <h3 className="font-serif text-2xl font-bold">Fast-Track Wholesale Desk</h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                For urgent bulk orders or showroom tie-ups, connect with <strong>Nitish Pandey</strong> & <strong>Vinit Pandey</strong> directly on WhatsApp.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Vinit%20Textiles,%20I%20am%20interested%20in%20a%20Wholesale/Franchise%20partnership"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#20BA5A] transition-colors w-full justify-center"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Connect on WhatsApp Now
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs space-y-3">
              <h4 className="font-serif text-base font-bold text-[#4A1D1B]">Manufacturing Facility Address</h4>
              <p className="text-xs text-[#6A5450] leading-relaxed">
                <strong>Vinit Textiles Private Limited</strong><br />
                Plot No. 42-45, Ring Road Textile Hub,<br />
                Surat, Gujarat — 395002, India.<br />
                Email: <a href="mailto:wholesale@vinittextiles.com" className="text-[#801B1A] underline">wholesale@vinittextiles.com</a><br />
                Phone: +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
