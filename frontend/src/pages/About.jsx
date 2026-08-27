import Placeholder from '../components/ui/Placeholder'

export default function About() {
  return (
    <section className="container-ambika py-10">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Placeholder label="Bridal editorial — Vinit Textiles brand story" tone="brown" ratio="aspect-[4/5]" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">About Vinit Textiles</p>
          <h1 className="font-display mt-3 text-4xl text-maroon">Sarees That Celebrate Indian Naree</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-brown/80">
            Vinit Textiles is a celebration of timeless Indian elegance, woven for the modern
            woman. Based in Surat's textile heartland, each piece blends heritage-inspired designs
            with contemporary silhouettes — premium quality, soft and comfortable, crafted with
            exclusive designs for every occasion.
          </p>
        </div>
      </div>
    </section>
  )
}
