import { useState } from 'react'
import { Link } from 'react-router-dom'

const blouseSizes = [
  { size: 'XS', bustIn: '32', bustCm: '81', waistIn: '26', waistCm: '66', shoulderIn: '13.5', shoulderCm: '34', armholeIn: '14.5', armholeCm: '37', lengthIn: '14', lengthCm: '35.5' },
  { size: 'S', bustIn: '34', bustCm: '86', waistIn: '28', waistCm: '71', shoulderIn: '14', shoulderCm: '35.5', armholeIn: '15', armholeCm: '38', lengthIn: '14.5', lengthCm: '37' },
  { size: 'M', bustIn: '36', bustCm: '91', waistIn: '30', waistCm: '76', shoulderIn: '14.5', shoulderCm: '37', armholeIn: '16', armholeCm: '40.5', lengthIn: '15', lengthCm: '38' },
  { size: 'L', bustIn: '38', bustCm: '96', waistIn: '32', waistCm: '81', shoulderIn: '15', shoulderCm: '38', armholeIn: '17', armholeCm: '43', lengthIn: '15.5', lengthCm: '39.5' },
  { size: 'XL', bustIn: '40', bustCm: '101', waistIn: '34', waistCm: '86', shoulderIn: '15.5', shoulderCm: '39.5', armholeIn: '18', armholeCm: '46', lengthIn: '16', lengthCm: '40.5' },
  { size: 'XXL', bustIn: '42', bustCm: '106', waistIn: '36', waistCm: '91', shoulderIn: '16', shoulderCm: '40.5', armholeIn: '19', armholeCm: '48', lengthIn: '16.5', lengthCm: '42' },
  { size: '3XL', bustIn: '44', bustCm: '112', waistIn: '38', waistCm: '96', shoulderIn: '16.5', shoulderCm: '42', armholeIn: '20', armholeCm: '51', lengthIn: '17', lengthCm: '43' },
]

export default function SizeChart() {
  const [unit, setUnit] = useState('inches')

  return (
    <div className="bg-[#FAF7F2] text-[#332421] min-h-screen py-10 sm:py-16">
      <div className="container-ambika max-w-4xl mx-auto">
        {/* Breadcrumb / Title */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">Fitting & Measurement Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1D1B] mt-2">
            Vinit Textiles Size Chart
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-2 max-w-lg mx-auto">
            Find your perfect drape and blouse fit. All measurements are tailored for elegance, comfort, and grace.
          </p>

          {/* Unit Toggle */}
          <div className="inline-flex items-center gap-1 bg-[#EFE7E1] p-1 rounded-full mt-6 border border-[#E3D6CD]">
            <button
              onClick={() => setUnit('inches')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                unit === 'inches' ? 'bg-[#801B1A] text-white shadow-xs' : 'text-[#634E4A] hover:text-black'
              }`}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                unit === 'cm' ? 'bg-[#801B1A] text-white shadow-xs' : 'text-[#634E4A] hover:text-black'
              }`}
            >
              CENTIMETERS (CM)
            </button>
          </div>
        </div>

        {/* Section 1: Saree Specifications */}
        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs mb-8">
          <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-3">
            Saree Dimensions & Blouse Piece
          </h2>
          <p className="text-xs sm:text-sm text-[#6A5450] leading-relaxed mb-6">
            Every Vinit Textiles saree conforms to traditional Indian weaving standards, offering ample length for pleating, pallu styling, and custom tailoring:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FFF4F0] p-4 rounded-lg border border-[#FADCD5] text-center">
              <span className="text-xs uppercase tracking-wider text-[#C44331] font-bold">Saree Length</span>
              <p className="font-serif text-xl font-bold text-[#4A1D1B] mt-1">5.5 Meters</p>
              <p className="text-[11px] text-[#7A615C] mt-0.5">Approx. 6.0 Yards (Full drape)</p>
            </div>
            <div className="bg-[#FFF4F0] p-4 rounded-lg border border-[#FADCD5] text-center">
              <span className="text-xs uppercase tracking-wider text-[#C44331] font-bold">Blouse Piece</span>
              <p className="font-serif text-xl font-bold text-[#4A1D1B] mt-1">0.8 Meters</p>
              <p className="text-[11px] text-[#7A615C] mt-0.5">Unstitched running fabric attached</p>
            </div>
            <div className="bg-[#FFF4F0] p-4 rounded-lg border border-[#FADCD5] text-center">
              <span className="text-xs uppercase tracking-wider text-[#C44331] font-bold">Saree Width</span>
              <p className="font-serif text-xl font-bold text-[#4A1D1B] mt-1">44–46 Inches</p>
              <p className="text-[11px] text-[#7A615C] mt-0.5">Standard height suitable up to 6ft</p>
            </div>
          </div>
        </div>

        {/* Section 2: Standard Blouse Size Guide */}
        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#4A1D1B]">
                Blouse Stitching & Readymade Size Guide
              </h2>
              <p className="text-xs text-[#7A615C]">
                Use body measurements without adding ease. Measurement values are in <strong>{unit.toUpperCase()}</strong>.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E3D6CD] bg-[#FAF7F2] text-[#4A1D1B] uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-bold">Size</th>
                  <th className="py-3 px-4 font-bold">Bust</th>
                  <th className="py-3 px-4 font-bold">Waist</th>
                  <th className="py-3 px-4 font-bold">Shoulder</th>
                  <th className="py-3 px-4 font-bold">Armhole</th>
                  <th className="py-3 px-4 font-bold">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6E0] text-[#553E3B]">
                {blouseSizes.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FFF9F7] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#801B1A]">{row.size}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? `${row.bustIn}"` : `${row.bustCm} cm`}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? `${row.waistIn}"` : `${row.waistCm} cm`}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? `${row.armholeIn}"` : `${row.armholeCm} cm`}</td>
                    <td className="py-3.5 px-4">{unit === 'inches' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: How to Measure */}
        <div className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs">
          <h2 className="font-serif text-xl font-bold text-[#4A1D1B] mb-4">
            How To Take Body Measurements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-[#5C4541]">
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FFEAE5] text-[#C44331] font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="font-bold text-[#4A1D1B]">Bust Measurement</p>
                <p className="text-xs text-[#7A615C] mt-0.5">Wrap the measuring tape around the fullest part of your bust while breathing normally.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FFEAE5] text-[#C44331] font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="font-bold text-[#4A1D1B]">Waist Measurement</p>
                <p className="text-xs text-[#7A615C] mt-0.5">Measure around your natural waistline, where the blouse waistband would sit.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FFEAE5] text-[#C44331] font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="font-bold text-[#4A1D1B]">Shoulder Width</p>
                <p className="text-xs text-[#7A615C] mt-0.5">Measure from the edge of one shoulder bone across the back to the edge of the other shoulder.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FFEAE5] text-[#C44331] font-bold flex items-center justify-center shrink-0">4</span>
              <div>
                <p className="font-bold text-[#4A1D1B]">Armhole Circumference</p>
                <p className="text-xs text-[#7A615C] mt-0.5">Wrap the tape from the top of your shoulder around your armpit back to the top.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[#FFF9F6] rounded-lg border border-[#F5DDD7] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6E5551]">
              Need custom stitching or unsure about your size? We are happy to guide you!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-sm bg-[#801B1A] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#681312] transition-colors whitespace-nowrap"
            >
              Ask Our Stylist
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
