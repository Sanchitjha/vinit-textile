import Placeholder from '../ui/Placeholder'

const looks = [
  { label: 'Festive lookbook — pastel saree drape', tone: 'mauve' },
  { label: 'Festive lookbook — everyday kurti styling', tone: 'gold' },
  { label: 'Festive lookbook — evening lehenga', tone: 'cream' },
]

export default function LookbookStrip() {
  return (
    <section className="container-ambika py-16">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {looks.map((look) => (
          <div key={look.label} className="overflow-hidden bg-cream">
            <Placeholder label={look.label} tone={look.tone} ratio="aspect-[3/4]" className="transition-transform duration-1000 hover:scale-105" />
          </div>
        ))}
      </div>
    </section>
  )
}
