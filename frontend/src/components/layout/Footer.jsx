import { Link } from 'react-router-dom'
import { FacebookIcon, InstagramIcon, MailIcon, PinterestIcon } from '../icons/Icons'

const helpLinks = ['Privacy Policy', 'Shipping Info', 'Returns & Exchanges', 'Terms & Conditions']
const companyLinks = ['About Us', 'Careers', 'Contact Us', 'Store Locator']

export default function Footer() {
  return (
    <footer className="bg-brown text-ivory">
      <div className="container-ambika grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-2xl tracking-[0.2em] text-ivory">
            AMBIKA
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
            Discover timeless elegance and craftsmanship, styled with tradition for the modern
            woman.
          </p>
          <div className="mt-6 flex gap-4">
            {[FacebookIcon, InstagramIcon, PinterestIcon].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-none border border-ivory/20 text-ivory/60 transition-colors hover:border-ivory hover:text-ivory"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-ivory">Help</h4>
          <ul className="mt-4 space-y-3 text-[13px] text-ivory/60">
            {helpLinks.map((link) => (
              <li key={link}>
                <a href="#" className="transition-colors hover:text-ivory">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-ivory">Company</h4>
          <ul className="mt-4 space-y-3 text-[13px] text-ivory/60">
            {companyLinks.map((link) => (
              <li key={link}>
                <a href="#" className="transition-colors hover:text-ivory">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-ivory">Contact</h4>
          <ul className="mt-4 space-y-3 text-[13px] text-ivory/60">
            <li>123 Heritage Lane, Ahmedabad, Gujarat</li>
            <li>+91 98765 43210</li>
            <li className="flex items-center gap-2">
              <MailIcon width={14} height={14} /> hello@ambika.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-ambika flex flex-col items-center justify-between gap-4 py-8 text-xs text-ivory/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Ambika. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {['Visa', 'Mastercard', 'UPI'].map((method) => (
              <span
                key={method}
                className="rounded-none border border-ivory/20 px-3 py-1.5 text-[10px] uppercase tracking-widest"
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
