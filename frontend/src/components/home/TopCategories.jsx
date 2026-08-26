import { Link } from 'react-router-dom'
import ArchFrame from '../ui/ArchFrame'
import Placeholder from '../ui/Placeholder'
import { categories } from '../../data/products'

export default function TopCategories() {
  return (
<<<<<<< HEAD:src/components/home/TopCategories.jsx
    <section className="container-ambika py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-vermillion">
        Shop By
      </p>
      <h2 className="font-display mt-2 text-center text-3xl text-maroon">Top Categories</h2>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.slug} to={`/shop/${category.slug}`} className="group text-center">
            <ArchFrame>
              <Placeholder
                tone={category.tone}
                ratio="aspect-[3/4]"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </ArchFrame>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-brown">
=======
    <section className="container-ambika py-20">
      <h2 className="font-display text-center text-4xl text-brown">Shop by Category</h2>
      <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.slug} to={`/shop/${category.slug}`} className="group text-center">
            <div className="overflow-hidden bg-cream">
              <Placeholder
                tone={category.tone}
                ratio="aspect-[3/4]"
                className="transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brown">
>>>>>>> 89fd1a727f8ef9ef6bfa757a8ed5db8dfb8edd8a:frontend/src/components/home/TopCategories.jsx
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
