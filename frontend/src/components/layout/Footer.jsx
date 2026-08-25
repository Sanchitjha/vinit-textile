import { Link } from 'react-router-dom'
import { FacebookIcon, InstagramIcon, MailIcon, PinterestIcon } from '../icons/Icons'

const helpLinks = ['Privacy Policy', 'Shipping Info', 'Returns & Exchanges', 'Terms & Conditions']
const companyLinks = ['About Us', 'Careers', 'Contact Us', 'Store Locator']

export default function Footer() {
  return (
    <footer className="bg-maroon text-cream">
      <div className="container-ambika grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-3xl tracking-[0.12em] text-ivory">
            AMBIKA
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
            Discover timeless elegance and craftsmanship, styled with tradition for the modern
            woman.
          </p>
          <div className="mt-5 flex gap-3">
            {[FacebookIcon, InstagramIcon, PinterestIcon].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/80 transition-colors hover:border-olive hover:text-olive"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-ivory">Help</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            {helpLinks.map((link) => (
              <li key={link}>
                <a href="#" className="transition-colors hover:text-olive">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-ivory">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            {companyLinks.map((link) => (
              <li key={link}>
                <a href="#" className="transition-colors hover:text-olive">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-ivory">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/70">
            <li>123 Heritage Lane, Ahmedabad, Gujarat</li>
            <li>+91 98765 43210</li>
            <li className="flex items-center gap-2">
              <MailIcon width={14} height={14} /> hello@ambika.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-ambika flex flex-col items-center justify-between gap-4 py-6 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Ambika. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {['Visa', 'Mastercard', 'UPI'].map((method) => (
              <span
                key={method}
                className="rounded border border-cream/25 px-2 py-1 text-[10px] uppercase tracking-wide"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
