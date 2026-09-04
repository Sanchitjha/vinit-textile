const looks = [
  { image: '/images/lookbook-1.webp', alt: 'Ivory saree with hand-embroidered floral and animal motifs' },
  { image: '/images/lookbook-2.webp', alt: 'Purple silk saree with gold zari border at a palace courtyard' },
  { image: '/images/lookbook-3.webp', alt: 'Teal silk saree with mirror-work border' },
]

export default function LookbookStrip() {
  return (
    <section className="container-ambika py-16">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {looks.map((look) => (
          <div key={look.image} className="aspect-[3/4] w-full overflow-hidden bg-cream flex items-center justify-center">
            <img
              src={look.image}
              alt={look.alt}
              className="h-full w-full object-contain transition-transform duration-1000 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
