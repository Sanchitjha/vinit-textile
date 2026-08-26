// Temple-arch/mihrab silhouette used for category & occasion tiles — a small
// ornamental nod to Indian architecture so tiles read as festive/traditional
// rather than generic e-commerce circles or squares.
export default function ArchFrame({ children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="rounded-t-full rounded-b-2xl bg-gold p-[6px] shadow-card">
        <span className="absolute left-1/2 top-[6px] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
        <div className="overflow-hidden rounded-t-full rounded-b-xl">{children}</div>
      </div>
    </div>
  )
}
