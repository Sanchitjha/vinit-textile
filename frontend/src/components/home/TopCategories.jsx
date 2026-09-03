import { Link } from 'react-router-dom'

export default function TopCategories() {
  return (
    <section className="container-ambika py-10">
      <Link to="/shop/saree" className="block overflow-hidden">
        <img
          src="/images/banner-sarees-collection.webp"
          alt="Sarees — Timeless Elegance, Just For You. Bestsellers/New Arrivals, Partywear Collection, Wedding Edit, Everyday Elegance/Office Wear, Pooja & Traditional, Bridal Edit"
          className="w-full object-cover"
        />
      </Link>
    </section>
  )
}
