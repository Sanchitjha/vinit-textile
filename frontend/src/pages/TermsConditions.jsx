import { Link } from 'react-router-dom'
import Seo from '../components/seo/Seo'

export default function TermsConditions() {
  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <Seo title="Terms & Conditions" description="Vinit Textiles' terms and conditions covering orders, pricing, product representation and intellectual property." />
      <div className="container-ambika max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">User Agreement</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-2">
            Effective Date: March 2026 | Vinit Textiles Private Limited
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-[#5A4541] leading-relaxed">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">1. Agreement to Terms</h2>
            <p>
              Welcome to Vinit Textiles. By accessing or using our website, placing an order, or utilizing our services, you agree to be legally bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
            </p>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">2. Product Representation & Colors</h2>
            <p>
              We take great care to accurately depict the true hues, weaves, zari shine, and textures of our sarees through high-definition photography. However, due to variations in monitor displays, smartphone screen calibration, and natural lighting, slight variations in color tone (within 5-10%) may occur and are inherent to digital shopping of handloom/jacquard textiles.
            </p>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">3. Pricing & Manufacturing Rates</h2>
            <p>
              All prices listed on our platform are in Indian Rupees (INR) and are inclusive of applicable GST unless explicitly stated otherwise. We reserve the right to revise pricing, launch limited-time promotional codes, or withdraw discounts at our discretion without prior notice.
            </p>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">4. Orders, Cancellations & Fulfillment</h2>
            <ul className="list-disc list-inside space-y-1 text-[#6A5450]">
              <li>Orders may be cancelled within <strong>24 hours</strong> of placement by reaching out to our support team, provided the package has not already been dispatched.</li>
              <li>Once dispatched from our Surat hub, orders cannot be cancelled mid-transit; however, you may utilize our 7-day return policy upon doorstep delivery.</li>
              <li>We reserve the right to cancel any order in cases of technical pricing errors, suspected fraudulent payment, or sudden out-of-stock situations. In such cases, 100% of the paid amount is refunded immediately.</li>
            </ul>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">5. Intellectual Property Rights</h2>
            <p>
              All brand trademarks, trade names, logos ("Vinit Textiles", "Timeless Indian Elegance, Made Accessible"), product photographs, text descriptions, graphics, and website architecture are the exclusive intellectual property of Vinit Textiles. Any unauthorized reproduction or commercial re-use without prior written consent is strictly prohibited.
            </p>
          </div>

          <div className="border-t border-[#F0E6E0] pt-6">
            <h2 className="font-serif text-lg font-bold text-[#4A1D1B] mb-2">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of India. Any legal claims or disputes arising shall be subject exclusively to the courts situated in <strong>Surat, Gujarat, India</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
