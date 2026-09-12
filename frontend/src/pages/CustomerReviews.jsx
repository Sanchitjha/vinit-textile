import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StarIcon, ShieldCheckIcon } from '../components/icons/Icons'
import Seo from '../components/seo/Seo'

const reviewsData = [
  {
    id: 1,
    name: 'Priyanka Sharma',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    title: 'Exquisite Banarasi Saree, true manufacturer rate!',
    comment: 'I ordered the Crimson Red Banarasi Silk saree for my brother’s wedding. The fabric drape is so soft and rich. In Jaipur showrooms similar sarees cost upwards of ₹8,000, but getting this directly from Vinit Textiles at manufacturing rate was mind-blowing!',
    date: '2 days ago',
    verified: true,
    product: 'Crimson Royal Banarasi Silk Saree',
    category: 'Silk',
  },
  {
    id: 2,
    name: 'Ananya Deshmukh',
    city: 'Pune, Maharashtra',
    rating: 5,
    title: 'Ready To Wear saree saved my day!',
    comment: 'I never knew how to drape pleats properly. The 1-minute ready to wear saree from Vinit Textiles fit like a dream. Pleats were crisp and the pallu fell gracefully. Got compliments all evening!',
    date: '1 week ago',
    verified: true,
    product: 'Wine Zari Work Ready To Wear Saree',
    category: 'Ready to Wear',
  },
  {
    id: 3,
    name: 'Meenakshi Sundaram',
    city: 'Chennai, Tamil Nadu',
    rating: 5,
    title: 'Exceptional pure weave quality',
    comment: 'Ordered two sarees for Diwali. Being from South India I am very particular about silk authenticity. The zari shine is subtle and graceful, not loud. Sowmya Mishra and team have done a splendid job.',
    date: '2 weeks ago',
    verified: true,
    product: 'Mustard Gold Kanjivaram Motif Saree',
    category: 'Bridal',
  },
  {
    id: 4,
    name: 'Ritu Agarwal',
    city: 'Kolkata, West Bengal',
    rating: 5,
    title: 'Wholesale order for our boutique was seamless',
    comment: 'We sourced 30 pieces for our Durga Puja edit. Nitish and Vinit Pandey guided us through the catalog personally. Fabric quality, color fastness, and packaging are top notch.',
    date: '3 weeks ago',
    verified: true,
    product: 'Handloom Tussar & Organza Collection',
    category: 'Festive',
  },
  {
    id: 5,
    name: 'Kavita Patel',
    city: 'Ahmedabad, Gujarat',
    rating: 5,
    title: 'Super fast delivery from Surat hub',
    comment: 'Got my saree within 48 hours in Ahmedabad. Packed in a beautiful sturdy box with butter paper and care instructions. Fabric feels like pure royal heritage.',
    date: '1 month ago',
    verified: true,
    product: 'Emerald Green Tissue Silk Saree',
    category: 'Silk',
  },
  {
    id: 6,
    name: 'Sneha Verma',
    city: 'New Delhi',
    rating: 5,
    title: 'Loved the transparency and price point',
    comment: 'Usually bridal sarees are marked up 3x in high-end Delhi boutiques. Vinit Textiles gives honest factory pricing without sacrificing an inch on craft. Truly timeless Indian elegance made accessible!',
    date: '1 month ago',
    verified: true,
    product: 'Pastel Peach Embroidered Bridal Saree',
    category: 'Bridal',
  },
]

export default function CustomerReviews() {
  const [filter, setFilter] = useState('All')

  const filteredReviews = filter === 'All'
    ? reviewsData
    : reviewsData.filter((r) => r.category === filter)

  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <Seo
        title="Customer Reviews"
        description="Read verified reviews from Vinit Textiles customers — 4.9/5 average rating from brides, festive shoppers and boutique owners across India."
      />
      <div className="container-ambika max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Real Stories, Real Praise</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A1D1B] mt-2">
            Loved By Women Across India
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-2 max-w-lg mx-auto">
            Discover verified reviews from brides, festive shoppers, and boutique owners who celebrate in Vinit Textiles.
          </p>
        </div>

        {/* Rating Summary Bar */}
        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-[#F0E6E0]">
            <div className="sm:pr-6">
              <span className="font-serif text-5xl font-bold text-[#801B1A]">4.9</span>
              <span className="text-sm font-semibold text-[#8A726E]"> / 5.0</span>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[#E5A93C] mt-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#8A726E] mt-1">Based on 1,450+ verified ratings</p>
            </div>

            <div className="pt-4 sm:pt-0 sm:px-6 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-12 text-[#634E4A]">5 Star</span>
                <div className="flex-1 bg-[#F0E6E0] rounded-full h-2">
                  <div className="bg-[#801B1A] h-2 rounded-full w-[94%]"></div>
                </div>
                <span className="w-8 text-right font-semibold text-[#4A1D1B]">94%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-[#634E4A]">4 Star</span>
                <div className="flex-1 bg-[#F0E6E0] rounded-full h-2">
                  <div className="bg-[#801B1A] h-2 rounded-full w-[5%]"></div>
                </div>
                <span className="w-8 text-right font-semibold text-[#4A1D1B]">5%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-[#634E4A]">3 Star</span>
                <div className="flex-1 bg-[#F0E6E0] rounded-full h-2">
                  <div className="bg-[#801B1A] h-2 rounded-full w-[1%]"></div>
                </div>
                <span className="w-8 text-right font-semibold text-[#4A1D1B]">1%</span>
              </div>
            </div>

            <div className="pt-4 sm:pt-0 sm:pl-6 text-center">
              <p className="font-serif text-lg font-bold text-[#4A1D1B]">99.2%</p>
              <p className="text-xs text-[#6A5450] mt-0.5">Recommend Vinit Textiles to family & friends</p>
              <Link
                to="/shop/saree"
                className="mt-4 inline-block rounded-sm bg-[#801B1A] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#681312] transition-colors"
              >
                Shop Bestsellers
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {['All', 'Silk', 'Ready to Wear', 'Bridal', 'Festive'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                filter === cat
                  ? 'bg-[#801B1A] text-white shadow-xs'
                  : 'bg-white border border-[#E3D6CD] text-[#634E4A] hover:bg-[#FAF0EC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-xl border border-[#EDE4DE] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-[#E5A93C]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#9A817D]">{rev.date}</span>
                </div>

                <h3 className="font-serif text-base font-bold text-[#4A1D1B] mb-2">
                  "{rev.title}"
                </h3>
                <p className="text-xs sm:text-sm text-[#5C4541] leading-relaxed mb-4">
                  {rev.comment}
                </p>
              </div>

              <div className="border-t border-[#F0E6E0] pt-4 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#4A1D1B] flex items-center gap-1.5">
                      {rev.name}
                      {rev.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-[#1E7E34] font-medium bg-[#EAF7ED] px-1.5 py-0.5 rounded-sm">
                          <ShieldCheckIcon className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-[#8C7570]">{rev.city}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C44331] font-semibold bg-[#FFF4F0] px-2 py-1 rounded-sm">
                    {rev.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
