import Placeholder from '../ui/Placeholder'

const looks = [
  { label: 'Festive lookbook — pastel saree drape', tone: 'mauve' },
  { label: 'Festive lookbook — everyday kurti styling', tone: 'olive' },
  { label: 'Festive lookbook — evening lehenga', tone: 'cream' },
]

export default function LookbookStrip() {
  return (
    <section className="container-ambika py-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {looks.map((look) => (
          <Placeholder key={look.label} label={look.label} tone={look.tone} ratio="aspect-[3/4]" />
        ))}
      </div>
    </section>
  )
}
