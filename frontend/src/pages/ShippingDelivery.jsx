import { Link } from 'react-router-dom'
import { TruckIcon, ShieldCheckIcon, SparkleIcon } from '../components/icons/Icons'

export default function ShippingDelivery() {
  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <div className="container-ambika max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Reliable & Fast Logistics</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-2 max-w-lg mx-auto">
            Directly from Surat's manufacturing hub to your doorstep with insured, tamper-proof packaging.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFEAE5] text-[#C44331] flex items-center justify-center mx-auto mb-3">
              <TruckIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#4A1D1B]">Free Pan-India Shipping</h3>
            <p className="text-xs text-[#7A615C] mt-1">On all domestic orders above ₹1,999. Nominal ₹99 for orders below.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFEAE5] text-[#C44331] flex items-center justify-center mx-auto mb-3">
              <SparkleIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#4A1D1B]">24–48 Hr Dispatch</h3>
            <p className="text-xs text-[#7A615C] mt-1">Ready stock items dispatched quickly from our central warehouse.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFEAE5] text-[#C44331] flex items-center justify-center mx-auto mb-3">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-[#4A1D1B]">Tamper-Proof Box</h3>
            <p className="text-xs text-[#7A615C] mt-1">Multi-layer moisture & transit protection for every delicate silk drape.</p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs space-y-8">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-3">
              1. Domestic Delivery Timelines
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4541] leading-relaxed mb-4">
              All orders are processed and dispatched within 24 to 48 business hours (Monday through Saturday, excluding national holidays). Estimated transit timelines post dispatch:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[#F0E6E0] rounded-lg p-4 bg-[#FAF7F2]">
                <p className="font-bold text-[#4A1D1B] text-sm">Metro Cities (Delhi, Mumbai, Bengaluru, etc.)</p>
                <p className="text-xs text-[#7A615C] mt-1"><strong>3 to 4 business days</strong></p>
              </div>
              <div className="border border-[#F0E6E0] rounded-lg p-4 bg-[#FAF7F2]">
                <p className="font-bold text-[#4A1D1B] text-sm">Tier 2, Tier 3 & Rest of India</p>
                <p className="text-xs text-[#7A615C] mt-1"><strong>5 to 7 business days</strong></p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-3">
              2. Cash on Delivery (COD)
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4541] leading-relaxed">
              We offer Cash on Delivery (COD) on eligible pin codes across India up to order values of ₹10,000. For orders above ₹10,000, prepaid payment via UPI, Credit/Debit Card, or Net Banking is required to protect high-value silks during transit.
            </p>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-3">
              3. Order Tracking & Live Updates
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4541] leading-relaxed">
              As soon as your package is dispatched, you will receive an automated email and WhatsApp alert containing your courier tracking number (AWB) and live tracking link (via Bluedart, Delhivery, DTDC, or Xpressbees).
            </p>
            <div className="mt-4">
              <Link
                to="/track-order"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#801B1A] hover:underline"
              >
                Track Your Existing Order Online &rarr;
              </Link>
            </div>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-3">
              4. International Shipping
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4541] leading-relaxed">
              Vinit Textiles ships worldwide to the USA, UK, UAE, Canada, Australia, and 50+ countries via DHL Express and FedEx. International delivery typically takes 7 to 12 business days. Customs duties and local import taxes, if applicable, are to be borne by the recipient.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
