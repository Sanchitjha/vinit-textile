import { useEffect, useState } from 'react'
import Hero from '../components/home/Hero'
import FeatureStrip from '../components/home/FeatureStrip'
import TopCategories from '../components/home/TopCategories'
import ShopByOccasion from '../components/home/ShopByOccasion'
import Banner from '../components/home/Banner'
import ProductGrid from '../components/home/ProductGrid'
import SplitFeature from '../components/home/SplitFeature'
import LookbookStrip from '../components/home/LookbookStrip'
import Newsletter from '../components/home/Newsletter'
import { apiClient } from '../api/client'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await apiClient.get('/sarees?limit=4&sort=newest')
        setProducts(res.data?.items || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchProducts()
  }, [])

  return (
    <>
      <Hero />
      <FeatureStrip />
      <TopCategories />
      <ShopByOccasion />

      <Banner
        eyebrow="Limited Time"
        title="New Arrivals up to 50% Off"
        cta="Buy Now"
        to="/shop/saree"
        tone="vermillion"
        label="New arrivals — festive couple in red & orange"
        align="left"
      />

      <ProductGrid
        title="Newest Collection"
        subtitle="Fresh drops from this season's edit"
        items={products}
        to="/shop/saree"
      />

      <SplitFeature
        eyebrow="Ready To Wear"
        title="Ready To Wear Saree"
        description="Browse and shop your favourite drape within a minute — pre-stitched, pre-pleated and ready to slip into for any occasion."
        cta="Buy Now"
        to="/shop/saree"
        tone="brown"
        label="Ready-to-wear saree product shots"
      />

      <SplitFeature
        eyebrow="Fabric & Feel"
        title="Cosy & Comfortable Fabric"
        description="Just because a piece is made for special occasions doesn't mean it can't be comfortable. Discover fabrics that feel as good as they look, hand-picked for every season."
        cta="Show More"
        to="/shop/kurti"
        tone="mauve"
        label="Woman in soft lavender ethnic wear"
        reverse
      />

      <Banner
        eyebrow="Bridal Edit"
        title="Bridal Beauty"
        subtitle="Discover more with full self confidence."
        cta="Explore Now"
        to="/shop/lehenga"
        tone="brown"
        label="Bridal couple in festive attire"
        variant="dark"
      />

      <LookbookStrip />
      <Newsletter />
    </>
  )
}
