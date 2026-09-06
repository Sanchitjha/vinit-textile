import { HeadsetIcon, ReturnIcon, TruckIcon } from '../icons/Icons'

const features = [
  { icon: TruckIcon, title: 'Free Shipping', desc: 'On all orders above ₹1,999' },
  { icon: ReturnIcon, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: HeadsetIcon, title: '24/7 Support', desc: "We're here whenever you need" },
]

export default function FeatureStrip() {
  return (
    <section className="container-ambika py-1 sm:py-2">
      <div className="grid grid-cols-3 gap-1 sm:gap-6 md:gap-8 border-y border-cream-dark py-2 sm:py-3.5">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center justify-center gap-1 min-[380px]:gap-2 sm:gap-4 text-left">
            <Icon className="w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 shrink-0 text-brown" />
            <div className="min-w-0">
              <p className="text-[9px] min-[380px]:text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-tight sm:tracking-widest text-brown leading-tight truncate sm:whitespace-normal">
                {title}
              </p>
              <p className="mt-0.5 text-[8px] min-[380px]:text-[9px] sm:text-xs text-brown-light leading-tight truncate sm:whitespace-normal">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
