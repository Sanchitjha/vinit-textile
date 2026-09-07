import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDownIcon, WhatsAppIcon } from '../components/icons/Icons'

const faqCategories = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long will it take for my order to arrive?',
        a: 'We dispatch all ready orders within 24 to 48 business hours from our Surat hub. Metro cities typically receive deliveries within 3 to 4 business days, while tier-2, tier-3, and remote locations take 5 to 7 business days.',
      },
      {
        q: 'Is shipping free across India?',
        a: 'Yes! We offer 100% Free Shipping on all domestic orders across India on cart values of ₹1,999 and above. A nominal shipping charge of ₹99 applies for orders below ₹1,999.',
      },
      {
        q: 'How do I track my order status?',
        a: 'Once your order is handed over to our courier partner (Bluedart / Delhivery), we will send you an AWB number and tracking link via SMS and email. You can also visit our "Track Your Order" page anytime.',
      },
      {
        q: 'Do you ship internationally outside India?',
        a: 'Yes, Vinit Textiles delivers to the USA, UK, UAE, Canada, Australia, and 50+ countries worldwide via DHL Express. International transit typically takes 7 to 12 business days.',
      },
    ],
  },
  {
    category: 'Payments & COD',
    items: [
      {
        q: 'What payment options do you support?',
        a: 'We accept all major payment methods: UPI (Google Pay, PhonePe, Paytm), Credit and Debit Cards (Visa, Mastercard, RuPay), Net Banking across 50+ banks, and Cash on Delivery (COD) on eligible pin codes.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes, COD is available for orders up to ₹10,000 for serviceable pin codes across India. For orders above ₹10,000, secure online prepaid payment is required.',
      },
      {
        q: 'Is it safe to pay online on Vinit Textiles?',
        a: 'Absolutely. All online transactions are processed through 256-bit bank-grade SSL encrypted payment gateways. We do not store any card numbers or banking passwords.',
      },
    ],
  },
  {
    category: 'Returns, Exchanges & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-Day Hassle-Free Return and Exchange Policy from the date of delivery. The saree must be unused, unwashed, and in original packaging with all brand tags intact.',
      },
      {
        q: 'How is the reverse pickup handled?',
        a: 'We arrange doorstep pickup through our courier partners for all serviceable locations. If your pin code is not covered for reverse pickup, you can self-ship and we reimburse courier expenses up to ₹300.',
      },
      {
        q: 'When will I get my refund?',
        a: 'For prepaid orders, the refund is credited back to your original payment method within 3 to 5 business days post quality inspection. For COD orders, refund is transferred directly to your bank account via NEFT within 5 to 7 business days.',
      },
    ],
  },
  {
    category: 'Sarees, Fabric & Weaves',
    items: [
      {
        q: 'How are Vinit Textiles prices so much lower than retail stores?',
        a: 'Vinit Textiles is built on a direct-from-manufacturer model based in Surat. We eliminate high retail markups, middle distributors, and costly mall rents, passing direct wholesale rates directly to you.',
      },
      {
        q: 'Do sarees come with a blouse piece?',
        a: 'Yes, all our sarees include an attached 0.8-meter unstitched blouse piece in matching or contrasting design that you can get tailored to your exact measurements.',
      },
      {
        q: 'How should I care for my silk and organza sarees?',
        a: 'We strongly recommend Dry Cleaning for pure silks, Banarasi brocades, and embellished bridal sarees to preserve the richness of the zari and longevity of the weave. Store them wrapped in a soft muslin cloth.',
      },
    ],
  },
  {
    category: 'Wholesale & Franchise',
    items: [
      {
        q: 'Can I purchase in bulk or wholesale for my boutique or store?',
        a: 'Yes! Wholesale and bulk inquiries are warmly welcomed. You can reach out through our "Own A Franchise / Wholesale" page or directly contact Nitish Pandey & Vinit Pandey for bulk catalogs and custom pricing.',
      },
    ],
  },
]

export default function Faqs() {
  const [openMap, setOpenMap] = useState({})

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <div className="container-ambika max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Clear Answers</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-2 max-w-lg mx-auto">
            Everything you need to know about shopping, delivery, fabric authenticity, and returns with Vinit Textiles.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {faqCategories.map((cat, catIdx) => (
            <div key={cat.category} className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#4A1D1B] mb-4 pb-2 border-b border-[#F0E6E0]">
                {cat.category}
              </h2>
              <div className="divide-y divide-[#F5ECE6]">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`
                  const isOpen = !!openMap[key]

                  return (
                    <div key={itemIdx} className="py-4 first:pt-0 last:pb-0">
                      <button
                        onClick={() => toggleItem(catIdx, itemIdx)}
                        className="w-full flex items-center justify-between gap-4 text-left font-serif text-sm sm:text-base font-semibold text-[#4A1D1B] hover:text-[#C44331] transition-colors"
                      >
                        <span>{item.q}</span>
                        <ChevronDownIcon
                          className={`w-4 h-4 shrink-0 text-[#8C726D] transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#C44331]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="mt-2.5 text-xs sm:text-sm text-[#614A46] leading-relaxed pr-6 animate-fadeIn">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 bg-[#FFF4F0] p-6 sm:p-8 rounded-xl border border-[#F5D5CE] text-center">
          <h3 className="font-serif text-lg font-bold text-[#4A1D1B]">Still Have Questions?</h3>
          <p className="text-xs sm:text-sm text-[#735A55] mt-1 max-w-md mx-auto">
            Our team is always here to assist you with order queries, bridal styling advice, or wholesale partnerships.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/919876543210?text=Hello%20Vinit%20Textiles,%20I%20have%20a%20question"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#20BA5A] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-sm bg-[#801B1A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#681312] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
