import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <div className="container-ambika max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Your Data Security</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-2">
            Last Updated: March 2026 | Vinit Textiles Private Limited
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-[#5A4541] leading-relaxed">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">1. Overview & Commitment</h2>
            <p>
              At Vinit Textiles ("we", "us", or "our"), respecting and safeguarding your personal privacy is fundamental to how we operate. This Privacy Policy details how we collect, use, store, and protect your information when you visit or make a purchase from our website (vinittextiles.com) and associated services.
            </p>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">2. Information We Collect</h2>
            <p className="mb-2">When you browse or interact with our platform, we collect relevant information to fulfill orders and enhance your user experience:</p>
            <ul className="list-disc list-inside space-y-1 text-[#6A5450]">
              <li><strong>Contact Information:</strong> Name, shipping address, billing address, email address, and mobile phone number for delivery and order alerts.</li>
              <li><strong>Order History & Preferences:</strong> Purchased sarees, wishlist items, sizing choices, and transaction references.</li>
              <li><strong>Payment Information:</strong> Handled securely by RBI-approved payment gateways (Razorpay, Paytm, Cashfree, UPI). <strong>We never store full card numbers, CVVs, or net banking passwords</strong> on our servers.</li>
              <li><strong>Technical & Browsing Data:</strong> IP address, device type, browser settings, and cookie identifiers for analytics and security.</li>
            </ul>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1 text-[#6A5450]">
              <li>To process, ship, track, and deliver your saree orders smoothly.</li>
              <li>To send order confirmation, dispatch updates, and OTPs via SMS/WhatsApp/Email.</li>
              <li>To handle 7-day returns, exchanges, and customer support inquiries.</li>
              <li>To send optional promotional discounts or festive announcements (you may unsubscribe at any time).</li>
              <li>To safeguard against fraud, unauthorized card usage, and cyber security risks.</li>
            </ul>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">4. Sharing with Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal data to any external advertising agencies. We only share essential details with verified operational partners:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#6A5450] mt-2">
              <li>Courier & logistics partners (Delhivery, Bluedart, Xpressbees) to deliver packages to your doorstep.</li>
              <li>Encrypted payment gateways to execute bank authorization for online transactions.</li>
              <li>SMS and transactional notification service providers for timely delivery updates.</li>
            </ul>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">5. Cookies & Tracking Technologies</h2>
            <p>
              Our website uses standard session cookies to remember your shopping cart items, track anonymous analytics, and preserve your login state. You can manage or disable cookie preferences in your browser settings.
            </p>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">6. Grievance Officer & Contact</h2>
            <p>
              For any questions regarding this Privacy Policy or your data rights, please contact our designated Grievance Officer:
            </p>
            <p className="mt-2 text-[#4A1D1B]">
              <strong>Grievance Officer:</strong> Nitish Pandey<br />
              <strong>Email:</strong> privacy@vinittextiles.com / support@vinittextiles.com<br />
              <strong>Address:</strong> Vinit Textiles, Ring Road Textile Market, Surat, Gujarat — 395002, India.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
