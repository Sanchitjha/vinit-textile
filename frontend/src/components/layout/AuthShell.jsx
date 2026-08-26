import Placeholder from '../ui/Placeholder'

export default function AuthShell({ label, tone = 'brown', children }) {
  return (
    <section className="container-ambika py-20">
      <div className="mx-auto grid max-w-5xl lg:grid-cols-2 bg-cream">
        <div className="hidden lg:block overflow-hidden">
          <Placeholder label={label} tone={tone} ratio="aspect-[3/4] h-full" className="h-full object-cover transition-transform duration-1000 hover:scale-105" />
        </div>
        <div className="flex flex-col justify-center px-8 py-16 sm:px-16 lg:py-20">{children}</div>
      </div>
    </section>
  )
}
