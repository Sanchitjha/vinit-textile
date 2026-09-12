import { Link } from 'react-router-dom'
import Seo from '../components/seo/Seo'

const blogArticles = [
  {
    id: 1,
    title: 'Top 7 Saree Trends Ruling the 2026 Wedding Season',
    category: 'Wedding Trends',
    date: 'March 2026',
    author: 'Sowmya Mishra',
    readTime: '4 min read',
    snippet: 'From regal metallic tissue weaves to pastel organzas with delicate cutwork borders, explore the silhouettes shaping modern Indian bridal trousseaus.',
    image: '/images/banner-new-arrivals.webp',
  },
  {
    id: 2,
    title: 'How to Drape a Saree in 3 Minutes: A Beginner’s Masterclass',
    category: 'Style & Drape',
    date: 'February 2026',
    author: 'Vinit Textiles Styling Team',
    readTime: '5 min read',
    snippet: 'Mastering the tuck, crisp pleat management, and graceful pallu placement without pinning stress. Step-by-step illustrated draping techniques.',
    image: '/images/banner-sarees-collection.webp',
  },
  {
    id: 3,
    title: 'The Rise of Ready-to-Wear: Why Modern Women Love Pre-Stitched Drapes',
    category: 'Innovation',
    date: 'February 2026',
    author: 'Editorial Desk',
    readTime: '3 min read',
    snippet: 'How pre-pleated, zip-and-wear sarees are preserving royal heritage while keeping up with the fast-paced life of working professionals and partygoers.',
    image: '/images/banner-timeless-elegance.webp',
  },
  {
    id: 4,
    title: 'How to Store and Care for Pure Silk & Banarasi Sarees at Home',
    category: 'Fabric Care',
    date: 'January 2026',
    author: 'Surat Master Weavers',
    readTime: '4 min read',
    snippet: 'Essential tips to prevent zari tarnishing: wrapping in breathable muslin, avoiding naphthalene balls directly on silk, and regular air-drying schedules.',
    image: '/images/banner-new-arrivals.webp',
  },
]

export default function Blog() {
  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <Seo
        title="Style Journal & Saree Guides"
        description="Draping guides, saree trend forecasts, festive inspirations and fabric care tips from Vinit Textiles."
      />
      <div className="container-ambika max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">The Saree Edit & Journal</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A1D1B] mt-2">
            Vinit Textiles Style Stories
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-3 max-w-xl mx-auto">
            Draping guides, trend forecasts, festive inspirations, and fabric wisdom straight from the heart of our craft.
          </p>
        </div>

        {/* Featured Post */}
        <div className="bg-white rounded-2xl border border-[#EDE4DE] overflow-hidden shadow-xs mb-12 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 h-64 lg:h-auto relative">
            <img
              src={blogArticles[0].image}
              alt={blogArticles[0].title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C44331] bg-[#FFEAE5] px-2.5 py-1 rounded-full">
                  {blogArticles[0].category}
                </span>
                <span className="text-[#9C827E]">{blogArticles[0].readTime}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#4A1D1B] leading-snug">
                {blogArticles[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#66504C] mt-3 leading-relaxed">
                {blogArticles[0].snippet}
              </p>
            </div>
            <div className="pt-6 border-t border-[#F0E6E0] mt-6 flex items-center justify-between text-xs">
              <span className="text-[#88716C]">By <strong>{blogArticles[0].author}</strong></span>
              <Link
                to="/shop/saree"
                className="font-bold text-[#801B1A] hover:underline"
              >
                Shop Festive Sarees &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogArticles.slice(1).map((art) => (
            <div key={art.id} className="bg-white rounded-xl border border-[#EDE4DE] overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-[#4A1D1B] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full">
                    {art.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-[#9C837F] mb-2">
                    <span>{art.date}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#4A1D1B] leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#6A5450] mt-2 leading-relaxed">
                    {art.snippet}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#F5ECE6] mt-4 flex items-center justify-between text-xs">
                <span className="text-[#8E7672]">{art.author}</span>
                <Link to="/shop/saree" className="font-bold text-[#801B1A] hover:underline">
                  Read & Shop &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
