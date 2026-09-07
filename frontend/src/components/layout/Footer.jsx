import { Link } from 'react-router-dom'
import { FacebookIcon, InstagramIcon, PinterestIcon, YouTubeIcon } from '../icons/Icons'

const customerServiceLinks = [
  'SIZE CHART',
  'SHIPPING & DELIVERY',
  'TRACK YOUR ORDER',
  'CUSTOMER REVIEWS',
  'RETURNS',
  'CONTACT US',
  "FAQ'S",
]

const aboutLinks = [
  'ABOUT US',
  'OUR STORES',
  'CONTACT US',
  'OWN A FRANCHISE',
  'BLOG',
  'RETURNS POLICY',
  'PRIVACY POLICY',
  'TERMS & CONDITIONS',
]

const popularSearches = [
  'Bridal Gowns',
  'White Sarees',
  'Soft Silk Sarees',
  'South Silk Sarees',
  'Mirror Work Lehenga Choli',
  'Sangeet Lehengas',
  'Art Silk Sarees',
  'Satin Sarees',
  'Tissue Sarees',
  'Brocade Sarees',
  'Heavy Sarees',
  'Wine Colour Sarees',
  'Crop Top Lehengas',
]

const trendingArticles = [
  'How To Drape A Saree?',
  'Blouse Designs',
  'Fashion Tips',
  'Types Of Sarees',
  'New Trend Sarees',
  'Saree With Jacket',
  'Types of Lehenga',
]

const paymentLogos = [
  {
    name: 'PayPal',
    svg: (
      <svg viewBox="0 0 100 32" className="h-5 w-auto">
        <path fill="#003087" d="M30.2 6.5h-10c-.8 0-1.5.6-1.6 1.4l-3.4 21.6c-.1.5.3 1 0.8 1h4.6c.7 0 1.3-.5 1.4-1.2l1-6.4c.1-.8.8-1.4 1.6-1.4h3.1c5.2 0 8.3-2.5 9.1-7.5.4-2.5 0-4.4-1.2-5.7-1.3-1.2-3.4-1.8-5.8-1.8z" />
        <path fill="#0079C1" d="M35.6 12.4c-.8 5-3.9 7.5-9.1 7.5h-3.1c-.8 0-1.5.6-1.6 1.4l-1.3 8.3c-.1.5.3 1 .8 1h4.2c.7 0 1.3-.5 1.4-1.2l.9-6c.1-.8.8-1.4 1.6-1.4h.8c4.6 0 7.3-2.2 8-6.6.3-2.1.1-3.8-.9-4.9-.5.7-1.1 1.3-1.7 1.9z" />
        <text x="44" y="22" fill="#003087" fontWeight="800" fontSize="16" fontFamily="system-ui, sans-serif">Pay</text>
        <text x="73" y="22" fill="#0079C1" fontWeight="800" fontSize="16" fontFamily="system-ui, sans-serif">Pal</text>
      </svg>
    ),
  },
  {
    name: 'VISA',
    svg: (
      <svg viewBox="0 0 64 24" className="h-5 w-auto">
        <path fill="#1A1F71" d="M24.7 4.2l-6.2 15.6h-4l-3.8-12.4c-.2-.9-.8-1.3-1.6-1.7L4.5 3.8v.3c2.4.5 5.1 1.4 6.7 2.2 1 .5 1.3 1 1.6 2.1l3.7 11.4h4.2l6.4-15.6h-2.4zm8.6 0h-3.2c-1 0-1.8.3-2.2 1.3l-6.4 14.3h4.2l1.3-3.6h5.2l.5 3.6h3.7l-3.1-15.6zm-4.5 8.7l2.1-5.8 1.2 5.8h-3.3zm18.3-8.7h-3.9l-4.9 15.6h3.9l1-2.7h4.9l.4 2.7h3.5l-4.9-15.6zm-3 9.1l1.7-4.6 1 4.6h-2.7z" />
        <path fill="#F7B600" d="M12.8 4.2L4.5 3.8 4.3 4c1.8.8 3.9 1.7 5.1 2.3 1 .5 1.3 1 1.6 2.1l1.8-4.2z" />
      </svg>
    ),
  },
  {
    name: 'Mastercard',
    svg: (
      <svg viewBox="0 0 54 32" className="h-6 w-auto">
        <circle cx="19" cy="16" r="13" fill="#EB001B" />
        <circle cx="35" cy="16" r="13" fill="#F79E1B" fillOpacity="0.9" />
        <path d="M27 6.1a12.9 12.9 0 0 1 5 9.9 12.9 12.9 0 0 1-5 9.9 12.9 12.9 0 0 1-5-9.9 12.9 12.9 0 0 1 5-9.9z" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    name: 'Maestro',
    svg: (
      <svg viewBox="0 0 54 32" className="h-6 w-auto">
        <circle cx="19" cy="16" r="13" fill="#EB001B" />
        <circle cx="35" cy="16" r="13" fill="#00669E" fillOpacity="0.9" />
        <path d="M27 6.1a12.9 12.9 0 0 1 5 9.9 12.9 12.9 0 0 1-5 9.9 12.9 12.9 0 0 1-5-9.9 12.9 12.9 0 0 1 5-9.9z" fill="#6C6BBD" />
      </svg>
    ),
  },
  {
    name: 'RuPay',
    svg: (
      <svg viewBox="0 0 85 24" className="h-5 w-auto">
        <text x="0" y="18" fill="#0A2540" fontWeight="900" fontSize="17" fontFamily="system-ui, sans-serif" fontStyle="italic">RuPay</text>
        <path d="M62 5l7 7-7 7" stroke="#00A859" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M70 5l7 7-7 7" stroke="#F37023" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Paytm',
    svg: (
      <svg viewBox="0 0 75 24" className="h-5.5 w-auto">
        <text x="0" y="19" fill="#002E6E" fontWeight="900" fontSize="20" fontFamily="system-ui, sans-serif">Pay</text>
        <text x="42" y="19" fill="#00BAF2" fontWeight="900" fontSize="20" fontFamily="system-ui, sans-serif">tm</text>
      </svg>
    ),
  },
  {
    name: 'Amazon Pay',
    svg: (
      <svg viewBox="0 0 95 26" className="h-5.5 w-auto">
        <text x="0" y="16" fill="#111111" fontWeight="bold" fontSize="14" fontFamily="system-ui, sans-serif">amazon</text>
        <text x="56" y="16" fill="#00A8E1" fontWeight="bold" fontSize="14" fontFamily="system-ui, sans-serif">pay</text>
        <path d="M8 20c14 5 32 4 43-2" stroke="#FF9900" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M49 16.5l3.5 2.5-2.5 3.5" fill="#FF9900" />
      </svg>
    ),
  },
  {
    name: 'Flipkart',
    svg: (
      <svg viewBox="0 0 95 26" className="h-6 w-auto">
        <rect x="0" y="2" width="22" height="22" rx="4" fill="#2874F0" />
        <path d="M8 6h7c1.4 0 2.2.8 2.2 2.2s-.8 2.2-2.2 2.2h-4.8v6.6H8V6z" fill="#FFE500" />
        <circle cx="15.2" cy="14" r="1.4" fill="#FFE500" />
        <text x="27" y="18" fill="#2874F0" fontWeight="900" fontSize="15" fontFamily="system-ui, sans-serif" fontStyle="italic">Flipkart</text>
      </svg>
    ),
  },
  {
    name: 'UPI',
    svg: (
      <svg viewBox="0 0 55 24" className="h-5.5 w-auto">
        <path d="M4 3l9 9-9 9" stroke="#F37023" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3l9 9-9 9" stroke="#00A859" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="25" y="18" fill="#0A2540" fontWeight="900" fontSize="14" fontFamily="system-ui, sans-serif">UPI</text>
      </svg>
    ),
  },
  {
    name: 'PhonePe',
    svg: (
      <svg viewBox="0 0 85 24" className="h-5.5 w-auto">
        <rect x="0" y="1" width="22" height="22" rx="11" fill="#5F259F" />
        <text x="11" y="16.5" fill="#FFFFFF" fontWeight="900" fontSize="13" textAnchor="middle" fontFamily="system-ui, sans-serif">पे</text>
        <text x="27" y="17" fill="#5F259F" fontWeight="800" fontSize="13" fontFamily="system-ui, sans-serif">PhonePe</text>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#FFF0EC] text-gray-700 text-xs">
      {/* Main Top Navigation */}
      <div className="container-ambika py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Column 1: CUSTOMER SERVICE */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold tracking-wider text-gray-900 uppercase mb-4">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2 text-[11px] text-gray-600 font-normal">
              {customerServiceLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-gray-900 transition-colors uppercase">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: ABOUT VINIT TEXTILES */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-bold tracking-wider text-gray-900 uppercase mb-4">
              ABOUT VINIT TEXTILES
            </h4>
            <ul className="space-y-2 text-[11px] text-gray-600 font-normal">
              {aboutLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-gray-900 transition-colors uppercase">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: SIGN UP AND SAVE */}
          <div className="lg:col-span-5">
            <h4 className="text-[11px] font-bold tracking-wider text-gray-900 uppercase mb-3">
              SIGN UP AND SAVE
            </h4>
            <p className="text-[11px] text-gray-600 mb-4 leading-relaxed">
              subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>

            {/* Social Media Round Buttons */}
            <div className="flex items-center gap-3 mb-6">
              {[
                { Icon: InstagramIcon, href: 'https://instagram.com/vinit.textiles', label: 'Instagram' },
                { Icon: FacebookIcon, href: '#', label: 'Facebook' },
                { Icon: YouTubeIcon, href: '#', label: 'YouTube' },
                { Icon: PinterestIcon, href: '#', label: 'Pinterest' },
              ].map(({ Icon, href, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow-2xs text-gray-800 hover:text-black hover:border-gray-400 hover:shadow-xs transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>


          </div>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="border-t border-[#F5D5CE]">
        <div className="container-ambika py-4 text-[11px] text-gray-600 leading-relaxed">
          <p>
            <span className="font-bold text-gray-800 mr-1.5">Popular Searches</span>
            {popularSearches.map((term, index) => (
              <span key={term}>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  {term}
                </a>
                {index < popularSearches.length - 1 && (
                  <span className="mx-1.5 text-gray-400">|</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Explore Trending Articles */}
      <div className="border-t border-[#F5D5CE]">
        <div className="container-ambika py-4 text-[11px] text-gray-600 leading-relaxed">
          <p>
            <span className="font-bold text-gray-800 mr-1.5">Explore Trending Articles</span>
            {trendingArticles.map((term, index) => (
              <span key={term}>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  {term}
                </a>
                {index < trendingArticles.length - 1 && (
                  <span className="mx-1.5 text-gray-400">|</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Payment & Partner Logos Row */}
      <div className="border-t border-[#F5D5CE]">
        <div className="container-ambika py-6">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {paymentLogos.map((item) => (
              <div
                key={item.name}
                title={item.name}
                className="flex items-center justify-center bg-white px-2.5 py-1.5 rounded-md border border-gray-200/80 shadow-2xs h-9 min-w-[58px] hover:shadow-xs transition-shadow"
              >
                {item.svg}
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-[10px] text-gray-500">
            © {new Date().getFullYear()} Vinit Textiles All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
