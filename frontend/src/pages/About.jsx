import Placeholder from '../components/ui/Placeholder'

export default function About() {
  return (
    <section className="container-ambika py-10">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Placeholder label="Bridal editorial — Ambika brand story" tone="brown" ratio="aspect-[4/5]" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">About Ambika</p>
          <h1 className="font-display mt-3 text-4xl text-maroon">Timeless Indian Elegance</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-brown/80">
            Ambika is a celebration of timeless Indian elegance, reimagined for the modern woman.
            Rooted in tradition and crafted with care, each piece blends heritage-inspired designs
            with contemporary silhouettes. From vibrant everyday wear to graceful festive
            ensembles, Ambika empowers women to express their inner strength and beauty — one
            thread at a time.
          </p>
        </div>
      </div>
    </section>
  )
}
