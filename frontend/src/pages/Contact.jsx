import { useState } from 'react'
import { MailIcon, WhatsAppIcon, ShieldCheckIcon } from '../components/icons/Icons'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'Order / Saree Inquiry', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <div className="container-ambika max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">We Are Here To Help</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A1D1B] mt-2">
            Contact Vinit Textiles
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-3 max-w-lg mx-auto">
            Have questions about an order, styling advice, or wholesale catalogs? Reach out to our Surat headquarters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#4A1D1B] border-b border-[#F0E6E0] pb-3">
                Headquarters & Studio
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-[#5C4541]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C44331]">Studio Address</p>
                  <p className="mt-1 leading-relaxed text-[#4A1D1B] font-medium">
                    8001-8004, The Rajhans Fabrizo Market,<br />
                    BRTS Road, Near Polaris Textile City,<br />
                    Magob, Surat, Gujarat 395012, India
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C44331]">Direct Phone & WhatsApp</p>
                  <p className="mt-1 font-semibold text-[#4A1D1B]">+91 97126 39342</p>
                  <p className="text-[11px] text-[#8C7470]">Monday – Saturday: 10:00 AM – 7:30 PM IST</p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C44331]">Official Email</p>
                  <p className="mt-1 text-[#4A1D1B] font-medium">vinittextiles21@gmail.com</p>
                  <p className="text-[11px] text-[#8C7470]">Support queries answered within 4 hours</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0E6E0]">
                <a
                  href="https://wa.me/919712639342?text=Hello%20Vinit%20Textiles,%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#20BA5A] transition-colors w-full"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Chat on WhatsApp Directly
                </a>
              </div>
            </div>

            <div className="bg-[#FFF4F0] rounded-2xl border border-[#F5D5CE] p-6 text-center space-y-2">
              <p className="font-serif text-sm font-bold text-[#4A1D1B]">Quick Customer Promise</p>
              <p className="text-xs text-[#7A615C]">
                Whether you are ordering for your wedding or stocking your boutique, our co-founders and team personally ensure every query is solved with care.
              </p>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EDE4DE] p-6 sm:p-10 shadow-xs">
            {sent ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#EAF7ED] text-[#1E7E34] flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#4A1D1B]">Message Dispatched!</h3>
                <p className="text-xs sm:text-sm text-[#6C5551] max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Our customer support team will get back to you at <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="rounded-sm bg-[#801B1A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#681312] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#4A1D1B] mb-2">
                  Send Us A Direct Message
                </h2>
                <p className="text-xs text-[#7A615C] mb-4">
                  Fill in the form below and we will respond via email or phone promptly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anjali Sharma"
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. anjali@gmail.com"
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 9876543210"
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                    >
                      <option>Order Status / Tracking</option>
                      <option>Saree Sizing & Blouse Stitching</option>
                      <option>7-Day Return / Exchange</option>
                      <option>Wholesale & Bulk Inquiries</option>
                      <option>General Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A1D1B] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, order number, or saree requirements..."
                    className="w-full rounded-sm border border-[#D9CBC3] bg-[#FAF7F2] px-3.5 py-2.5 text-xs sm:text-sm focus:border-[#801B1A] focus:bg-white focus:outline-hidden"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-sm bg-[#801B1A] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#681312] transition-colors shadow-xs"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
