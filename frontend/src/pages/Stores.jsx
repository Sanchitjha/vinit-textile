import { Link } from 'react-router-dom'
import { WhatsAppIcon } from '../components/icons/Icons'

const storeLocations = [
  {
    name: 'Surat Flagship Hub & Manufacturing Studio',
    tag: 'Headquarters & Studio',
    address: 'Ring Road Textile Market, Surat, Gujarat — 395002, India',
    phone: '+91 98765 43210',
    email: 'surat@vinittextiles.com',
    hours: 'Monday – Saturday: 10:00 AM – 8:00 PM (Sunday by Appointment)',
    features: ['500+ Pure Silk & Banarasi Weaves on display', 'Direct Manufacturing-Rate Counters', 'Bridal Trial Suites', 'Wholesale Viewing Lounge'],
  },
  {
    name: 'Delhi Experience Studio',
    tag: 'Opening Soon (Winter 2026)',
    address: 'Chandni Chowk / South Extension, New Delhi — 110049, India',
    phone: '+91 98765 43210',
    email: 'delhi@vinittextiles.com',
    hours: 'Opening Soon — Register for VIP Launch Invitations',
    features: ['Bridal Couture Sarees', 'Stylist Consultations', 'Same-Day Alterations'],
  },
  {
    name: 'Bengaluru Experience Hub',
    tag: 'Opening Soon (2026)',
    address: 'Commercial Street / Indiranagar, Bengaluru, Karnataka — 560038, India',
    phone: '+91 98765 43210',
    email: 'bengaluru@vinittextiles.com',
    hours: 'Opening Soon — Register for VIP Launch Invitations',
    features: ['South Silk & Kanjivaram Special Edits', 'Boutique Wholesaler Desk'],
  },
]

export default function Stores() {
  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <div className="container-ambika max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Visit Our Studios</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A1D1B] mt-2">
            Experience Vinit Textiles In Person
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-3 max-w-xl mx-auto">
            Touch and feel authentic weaves, see the intricate zari in true daylight, and enjoy personalized consultations with our draping specialists.
          </p>
        </div>

        {/* Store Cards */}
        <div className="space-y-8">
          {storeLocations.map((store, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C44331] bg-[#FFEAE5] px-2.5 py-1 rounded-full">
                    {store.tag}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#4A1D1B]">{store.name}</h2>
                <p className="text-xs sm:text-sm text-[#5C4541] leading-relaxed">
                  <strong>Address:</strong> {store.address}
                </p>
                <p className="text-xs sm:text-sm text-[#5C4541]">
                  <strong>Hours:</strong> {store.hours}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {store.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[11px] text-[#6E5551] bg-[#FAF7F2] border border-[#E8DDD6] px-2.5 py-1 rounded-md"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <a
                  href={`https://wa.me/919876543210?text=Hello%20Vinit%20Textiles,%20I%20would%20like%20to%20book%20a%20visit%20at%20${encodeURIComponent(store.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#20BA5A] transition-colors text-center"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Book Studio Visit
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-sm border border-[#801B1A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#801B1A] hover:bg-[#801B1A]/5 transition-colors text-center"
                >
                  Get Directions & Call
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Video Consultation Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#4A1D1B] to-[#782321] rounded-2xl p-8 sm:p-10 text-white text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold">Live Video Shopping</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">Cannot Visit Our Surat Studio?</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Experience the sarees live over a 1-on-1 HD WhatsApp video call. Our in-house stylists will drape and display the collections in real-time.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="https://wa.me/919876543210?text=Hi%20Vinit%20Textiles,%20I%20want%20to%20book%20a%20Live%20Video%20Shopping%20Session"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-sm bg-white px-7 py-3 text-xs font-bold uppercase tracking-widest text-[#4A1D1B] hover:bg-[#FAF0ED] transition-colors shadow-sm"
            >
              Book Video Call
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
