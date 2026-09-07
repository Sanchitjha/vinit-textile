import { Link } from 'react-router-dom'
import { SparkleIcon, TruckIcon, ShieldCheckIcon, StarIcon } from '../components/icons/Icons'

export default function About() {
  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F2] to-[#FAF7F2] py-16 sm:py-24 border-b border-[#F0E4DE]">
        <div className="container-ambika text-center max-w-4xl mx-auto">
          <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#C44331] bg-[#FFEAE5] px-4 py-1.5 rounded-full mb-4">
            Our Heritage & Vision
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#4A1D1B] leading-tight">
            Three Minds. One Vision. <br className="hidden sm:inline" />
            <span className="text-[#C44331] italic font-serif">One Name — Vinit Textiles.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#6A4E49] leading-relaxed max-w-2xl mx-auto">
            What started as a vision in 2024 has grown into a brand built on one belief — that premium sarees should be beautiful, authentic and accessible.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop/saree"
              className="inline-flex items-center justify-center rounded-sm bg-[#801B1A] px-7 py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-white hover:bg-[#681312] transition-colors shadow-sm"
            >
              Explore Collection
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-sm border border-[#801B1A] px-7 py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#801B1A] hover:bg-[#801B1A]/5 transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* The Story & Roots */}
      <section className="container-ambika py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/5] max-w-md mx-auto">
              <img
                src="/images/banner-timeless-elegance.webp"
                alt="Vinit Textiles Handcrafted Elegance"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-widest text-gold font-semibold">Established 2024</p>
                <p className="font-serif text-xl font-bold mt-1">From Loom to Wardrobe</p>
                <p className="text-xs text-white/90 mt-1">Direct manufacturing excellence, bringing pure grace to every celebration.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C44331]">
              <span className="w-6 h-px bg-[#C44331]"></span>
              The Genesis
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#4A1D1B] leading-snug">
              Crafting Grace, Redefining Affordability
            </h2>
            <p className="text-sm sm:text-base text-[#5A4541] leading-relaxed">
              At the heart of Vinit Textiles is the aspiration to celebrate the timeless beauty of the Indian saree. Every drape tells a story of heritage, weave, and the unmatched artisan spirit of Indian weavers.
            </p>
            <p className="text-sm sm:text-base text-[#5A4541] leading-relaxed">
              After establishing our roots in 2024, <strong>2026 marks an exciting new chapter</strong> as Vinit Textiles officially steps onto online platforms — taking our handcrafted and curated collections beyond physical boundaries and directly into wardrobes across India.
            </p>
            
            <div className="bg-[#FFF4F0] border-l-4 border-[#C44331] p-5 rounded-r-lg">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C44331]">
                Our Promise Is Simple:
              </h3>
              <p className="font-serif text-lg sm:text-xl font-semibold text-[#4A1D1B] mt-1">
                Premium sarees. Exceptional quality. Manufacturing-rate prices.
              </p>
              <p className="text-xs sm:text-sm text-[#6C5551] mt-2">
                Whether you shop retail or wholesale, every single piece is selected with an uncompromising eye for fabric quality, intricate artistry, and genuine value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Founders Section */}
      <section className="bg-white py-16 sm:py-24 border-y border-[#EFE7E2]">
        <div className="container-ambika">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C44331]">The People Behind The Brand</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
              Meet The Founders
            </h2>
            <p className="text-sm text-[#735D59] mt-3">
              Three minds unified by one shared passion — making authentic Indian ethnic wear accessible to all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Sowmya Mishra */}
            <div className="bg-[#FAF7F2] rounded-xl p-8 text-center border border-[#EDE4DE] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 mx-auto rounded-full bg-[#FFEAE5] flex items-center justify-center text-[#C44331] font-serif text-2xl font-bold border-2 border-[#F7D0C8] mb-6">
                  SM
                </div>
                <h3 className="font-serif text-xl font-bold text-[#4A1D1B]">Sowmya Mishra</h3>
                <p className="text-xs uppercase tracking-widest text-[#C44331] font-semibold mt-1">Vision, Creativity & Passion</p>
                <div className="w-10 h-px bg-[#E3D7D1] mx-auto my-4"></div>
                <p className="text-xs sm:text-sm text-[#634E4A] leading-relaxed">
                  The woman bringing her creative vision, aesthetic sensibilities, and heartfelt passion to curate collections that resonate with modern women while upholding ethnic authenticity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8DED8] text-[11px] text-[#9A817D] italic">
                Co-Founder & Creative Director
              </div>
            </div>

            {/* Vinit Pandey */}
            <div className="bg-[#FAF7F2] rounded-xl p-8 text-center border border-[#EDE4DE] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 mx-auto rounded-full bg-[#FFEAE5] flex items-center justify-center text-[#C44331] font-serif text-2xl font-bold border-2 border-[#F7D0C8] mb-6">
                  VP
                </div>
                <h3 className="font-serif text-xl font-bold text-[#4A1D1B]">Vinit Pandey</h3>
                <p className="text-xs uppercase tracking-widest text-[#C44331] font-semibold mt-1">Strategy & Operations</p>
                <div className="w-10 h-px bg-[#E3D7D1] mx-auto my-4"></div>
                <p className="text-xs sm:text-sm text-[#634E4A] leading-relaxed">
                  One of the core minds driving sourcing, manufacturing excellence, and strategic expansion, ensuring direct-from-loom pricing without compromising an ounce of quality.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8DED8] text-[11px] text-[#9A817D] italic">
                Co-Founder & Head of Operations
              </div>
            </div>

            {/* Nitish Pandey */}
            <div className="bg-[#FAF7F2] rounded-xl p-8 text-center border border-[#EDE4DE] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-20 h-20 mx-auto rounded-full bg-[#FFEAE5] flex items-center justify-center text-[#C44331] font-serif text-2xl font-bold border-2 border-[#F7D0C8] mb-6">
                  NP
                </div>
                <h3 className="font-serif text-xl font-bold text-[#4A1D1B]">Nitish Pandey</h3>
                <p className="text-xs uppercase tracking-widest text-[#C44331] font-semibold mt-1">Growth & Brand Strength</p>
                <div className="w-10 h-px bg-[#E3D7D1] mx-auto my-4"></div>
                <p className="text-xs sm:text-sm text-[#634E4A] leading-relaxed">
                  The strength behind expanding customer relationships, technology, and wholesale networks — spearheading the 2026 digital milestone across pan-India delivery channels.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E8DED8] text-[11px] text-[#9A817D] italic">
                Co-Founder & Growth Lead
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-serif text-base sm:text-lg italic text-[#543F3C]">
              “Together, we are building more than just a saree brand — we are building a name you can trust.”
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Vinit Textiles */}
      <section className="container-ambika py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C44331]">Direct From Manufacturers</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
            Why Vinit Textiles Stands Apart
          </h2>
          <p className="text-sm text-[#735D59] mt-3">
            Cutting out unnecessary middlemen to bring you true artisan weaves at pure factory prices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-2xs">
            <div className="w-12 h-12 rounded-lg bg-[#FFEFEA] flex items-center justify-center text-[#C44331] mb-4">
              <SparkleIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#4A1D1B]">Pure Artisan Weaves</h3>
            <p className="text-xs text-[#6A5450] mt-2 leading-relaxed">
              From Banarasi brocades and Kanjivaram silks to lightweight organza and ready-to-wear drapes, each textile is curated with precision.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-2xs">
            <div className="w-12 h-12 rounded-lg bg-[#FFEFEA] flex items-center justify-center text-[#C44331] mb-4">
              <span className="font-serif font-bold text-xl">₹</span>
            </div>
            <h3 className="font-serif text-base font-bold text-[#4A1D1B]">Manufacturing-Rate Prices</h3>
            <p className="text-xs text-[#6A5450] mt-2 leading-relaxed">
              No retail markups or showroom inflations. You get direct access to wholesale pricing whether buying 1 saree or 100 sarees.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-2xs">
            <div className="w-12 h-12 rounded-lg bg-[#FFEFEA] flex items-center justify-center text-[#C44331] mb-4">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#4A1D1B]">7-Day Easy Returns</h3>
            <p className="text-xs text-[#6A5450] mt-2 leading-relaxed">
              Shop with absolute peace of mind. If the drape doesn't delight you, return or exchange it hassle-free within 7 days.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDE4DE] shadow-2xs">
            <div className="w-12 h-12 rounded-lg bg-[#FFEFEA] flex items-center justify-center text-[#C44331] mb-4">
              <TruckIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-[#4A1D1B]">Pan-India Express Shipping</h3>
            <p className="text-xs text-[#6A5450] mt-2 leading-relaxed">
              Dispatched swiftly within 24-48 hours. Free shipping across India on orders above ₹1,999 with safe packaging.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Sign-off Banner */}
      <section className="bg-[#4A1D1B] text-white py-14 text-center">
        <div className="container-ambika max-w-3xl mx-auto space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">VINIT TEXTILES</p>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-wide">
            Timeless Indian Elegance, Made Accessible.
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
            Join thousands of women across India who drape our sarees for weddings, pujas, festivals and life’s special memories.
          </p>
          <div className="pt-4">
            <Link
              to="/shop/saree"
              className="inline-block rounded-sm bg-[#D4A373] px-8 py-3 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#3B1514] hover:bg-[#E2B384] transition-colors"
            >
              Shop The Sarees
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
