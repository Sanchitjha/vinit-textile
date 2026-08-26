import { LeafOrnament } from '../icons/Icons'

// Stand-in for real product/lifestyle photography.
// The Behance mockups use licensed photoshoots we can't redistribute here —
// swap the `label` spots for real images (e.g. src="/images/saree-01.jpg") when assets are ready.
const TONES = {
  cream: 'from-[#e9dcc9] to-[#f4ebe1] text-brown/40',
  brown: 'from-[#6b3410] to-[#3e150b] text-cream/30',
  maroon: 'from-[#7a1e28] to-[#3e150b] text-cream/30',
  mauve: 'from-[#8b5a6b] to-[#5c1220] text-ivory/40',
  gold: 'from-[#c9972e] to-[#8a6a4a] text-maroon/30',
  vermillion: 'from-[#e15c33] to-[#7a1e28] text-ivory/40',
  teal: 'from-[#0f5c56] to-[#123a37] text-ivory/40',
  ivory: 'from-[#fbf7f2] to-[#e9dcc9] text-brown/35',
}

export default function Placeholder({
  label,
  tone = 'cream',
  ratio = 'aspect-[3/4]',
  className = '',
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${TONES[tone]} ${ratio} ${className}`}
    >
      <LeafOrnament className="absolute -right-4 -top-4 rotate-90" />
      <LeafOrnament className="absolute -bottom-6 -left-6 rotate-[-90deg]" />
      {label && (
        <span className="font-display px-4 text-center text-sm italic tracking-wide">
          {label}
        </span>
      )}
    </div>
  )
}
