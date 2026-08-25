import { HeadsetIcon, ReturnIcon, TruckIcon } from '../icons/Icons'

const features = [
  { icon: TruckIcon, title: 'Free Shipping', desc: 'On all orders above ₹1,999' },
  { icon: ReturnIcon, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: HeadsetIcon, title: '24/7 Support', desc: "We're here whenever you need" },
]

export default function FeatureStrip() {
  return (
    <section className="container-ambika py-16">
      <div className="grid gap-8 border-y border-cream-dark py-12 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center justify-center gap-5">
            <Icon className="shrink-0 text-brown" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brown">{title}</p>
              <p className="mt-1 text-xs text-brown-light">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
