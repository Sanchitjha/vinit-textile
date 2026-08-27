import { Link } from 'react-router-dom'
import { FacebookIcon, InstagramIcon, MailIcon, PinterestIcon } from '../icons/Icons'

const helpLinks = ['Privacy Policy', 'Shipping Info', 'Returns & Exchanges', 'Terms & Conditions']
const companyLinks = ['About Us', 'Careers', 'Contact Us', 'Store Locator']

export default function Footer() {
  return (
    <footer className="bg-maroon text-ivory">
      <div className="container-ambika grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-xl tracking-[0.15em] text-ivory">
            VINIT TEXTILES
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
            Sarees that celebrate Indian Naree — premium quality, soft &amp; comfortable, crafted
            with exclusive designs.
          </p>
          <div className="mt-6 flex gap-4">
            {[
              { Icon: FacebookIcon, href: '#' },
              { Icon: InstagramIcon, href: 'https://instagram.com/vinit.textiles' },
              { Icon: PinterestIcon, href: '#' },
            ].map(({ Icon, href }, index) => (
              <a
                key={index}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/30 text-cream/80 transition-colors hover:border-gold hover:text-gold"
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
                <a href="#" className="transition-colors hover:text-gold">
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
                <a href="#" className="transition-colors hover:text-gold">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-ivory">Contact</h4>
          <ul className="mt-4 space-y-3 text-[13px] text-ivory/60">
            <li>
              8001-8004, The Rajhans Fabrizo Market, BRTS Road,
              <br />
              Near Polaris Textile City, Magob, Surat, Gujarat 395012
            </li>
            <li>WhatsApp: +91 97126 39342</li>
            <li className="flex items-center gap-2">
              <MailIcon width={14} height={14} /> vinittextiles21@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-ambika flex flex-col items-center justify-between gap-4 py-8 text-xs text-ivory/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Vinit Textiles. All rights reserved. · GSTIN:
            24FDFPP3368P1ZU
          </p>
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
