import Placeholder from '../ui/Placeholder'

export default function AuthShell({ label, tone = 'brown', children }) {
  return (
    <section className="container-ambika py-12">
      <div className="mx-auto grid max-w-4xl overflow-hidden border border-cream-dark bg-ivory shadow-card lg:grid-cols-2">
        <div className="hidden lg:block">
          <Placeholder label={label} tone={tone} ratio="aspect-auto h-full" className="h-full" />
        </div>
        <div className="px-6 py-10 sm:px-12">{children}</div>
      </div>
    </section>
  )
}
