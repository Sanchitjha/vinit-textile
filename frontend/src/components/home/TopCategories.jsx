import { Link } from 'react-router-dom'

export default function TopCategories() {
  return (
    <section className="py-2">
      <div className="container-ambika overflow-x-auto scrollbar-hide">
        <Link to="/shop/saree" className="block min-w-[800px] sm:min-w-0">
          <img
            src="/images/banner-sarees-collection.webp"
            alt="Sarees — Timeless Elegance, Just For You. Bestsellers/New Arrivals, Partywear Collection, Wedding Edit, Everyday Elegance/Office Wear, Pooja & Traditional, Bridal Edit"
            className="w-full object-cover"
          />
        </Link>
      </div>
    </section>
  )
}
