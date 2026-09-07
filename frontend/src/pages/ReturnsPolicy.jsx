import { Link } from 'react-router-dom'
import { ReturnIcon, ShieldCheckIcon, WhatsAppIcon } from '../components/icons/Icons'

export default function ReturnsPolicy() {
  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <div className="container-ambika max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Hassle-Free & Transparent</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
            Returns & Exchange Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-2 max-w-lg mx-auto">
            We stand by the craftsmanship of every saree. If you are not completely delighted with your purchase, our 7-day policy has you covered.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFEAE5] text-[#C44331] flex items-center justify-center mx-auto mb-3 font-serif font-bold text-lg">
              7D
            </div>
            <h3 className="font-serif font-bold text-[#4A1D1B]">7 Days Return Window</h3>
            <p className="text-xs text-[#7A615C] mt-1">Initiate a return or exchange within 7 days of delivery date.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFEAE5] text-[#C44331] flex items-center justify-center mx-auto mb-3">
              <ReturnIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#4A1D1B]">Doorstep Reverse Pickup</h3>
            <p className="text-xs text-[#7A615C] mt-1">Our courier partners will collect the package from your address.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFEAE5] text-[#C44331] flex items-center justify-center mx-auto mb-3">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#4A1D1B]">100% Quick Refund</h3>
            <p className="text-xs text-[#7A615C] mt-1">Directly to original payment source (or bank account for COD).</p>
          </div>
        </div>

        {/* Full Details Card */}
        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs space-y-8">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-3">
              1. Return & Exchange Eligibility
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4541] leading-relaxed mb-3">
              To be eligible for a return or exchange, your item must satisfy the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#6E5753]">
              <li>Item must be unused, unworn, unwashed, and undamaged.</li>
              <li>All original brand tags, barcodes, and packaging must be intact.</li>
              <li>The saree must not have been folded or creased improperly, and the unstitched blouse piece must remain attached.</li>
              <li>Request must be raised within 7 calendar days of delivery.</li>
            </ul>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-3">
              2. How to Initiate a Return or Exchange
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4541] leading-relaxed mb-4">
              Returning or exchanging your order is seamless and can be done in 3 simple steps:
            </p>
            <div className="space-y-3 text-xs sm:text-sm text-[#5C4541]">
              <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#F0E6E0]">
                <strong>Step 1: Contact Support</strong> — Email us at <a href="mailto:support@vinittextiles.com" className="text-[#801B1A] underline">support@vinittextiles.com</a> or WhatsApp us at <strong>+91 98765 43210</strong> with your Order ID and photos of the product.
              </div>
              <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#F0E6E0]">
                <strong>Step 2: Reverse Pickup</strong> — Once approved, our courier partner will arrange doorstep pickup within 48 to 72 business hours.
              </div>
              <div className="p-3.5 bg-[#FAF7F2] rounded-lg border border-[#F0E6E0]">
                <strong>Step 3: Quality Check & Refund</strong> — Upon receiving the saree at our Surat hub, our team conducts a quick Quality Inspection. Your refund or replacement is dispatched within 48 hours of approval.
              </div>
            </div>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-3">
              3. Refund Modes & Timelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="border border-[#F0E6E0] rounded-lg p-4 bg-[#FFF9F7]">
                <p className="font-bold text-[#4A1D1B]">Prepaid Orders (UPI / Cards / Net Banking)</p>
                <p className="text-xs text-[#7A615C] mt-1">Refund is credited back to the original payment source within <strong>3 to 5 business days</strong>.</p>
              </div>
              <div className="border border-[#F0E6E0] rounded-lg p-4 bg-[#FFF9F7]">
                <p className="font-bold text-[#4A1D1B]">Cash On Delivery (COD) Orders</p>
                <p className="text-xs text-[#7A615C] mt-1">Refund is processed via direct Bank NEFT transfer into your account within <strong>5 to 7 business days</strong>.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-3">
              4. Non-Returnable Items
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4541] leading-relaxed">
              Customized or stitched blouse orders, custom altered sarees, and products sold during final clearance/flash blowouts are non-returnable, unless there is an authentic manufacturing defect reported within 24 hours of delivery.
            </p>
          </div>
        </div>

        {/* WhatsApp assistance */}
        <div className="mt-8 text-center bg-[#FFF4F0] p-6 rounded-xl border border-[#F5D5CE]">
          <p className="font-serif text-base font-bold text-[#4A1D1B]">Need Immediate Assistance with a Return?</p>
          <p className="text-xs text-[#735A55] mt-1">Our support specialists are ready to help you on WhatsApp.</p>
          <a
            href="https://wa.me/919876543210?text=Hi%20Vinit%20Textiles,%20I%20would%20like%20to%20request%20a%20return/exchange"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#20BA5A] transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Chat with Returns Team
          </a>
        </div>
      </div>
    </div>
  )
}
