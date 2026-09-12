import { useEffect, useState } from 'react'
import Hero from '../components/home/Hero'
import { onlyRealProducts } from '../utils/catalogue'
import AnnouncementTicker from '../components/layout/AnnouncementTicker'
import FeatureStrip from '../components/home/FeatureStrip'
import TopCategories from '../components/home/TopCategories'
import ShopByOccasion from '../components/home/ShopByOccasion'
import Banner from '../components/home/Banner'
import ProductGrid from '../components/home/ProductGrid'
import SplitFeature from '../components/home/SplitFeature'
import LookbookStrip from '../components/home/LookbookStrip'
import EntireCollectionGrid from '../components/home/EntireCollectionGrid'
import Newsletter from '../components/home/Newsletter'
import { apiClient } from '../api/client'
import Seo from '../components/seo/Seo'
import { SITE_URL, SITE_NAME } from '../lib/seoConfig'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await apiClient.get('/sarees?limit=4&sort=newest')
        setProducts(onlyRealProducts(res.data?.items))
      } catch (err) {
        console.error(err)
      }
    }
    fetchProducts()
  }, [])

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.webp`,
    sameAs: [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <Seo jsonLd={[organizationJsonLd, websiteJsonLd]} />
      <Hero />
      <AnnouncementTicker />
      <TopCategories />
      <ShopByOccasion />

      <Banner
        title="New Arrivals up to 50% Off"
        to="/shop/saree"
        image="/images/banner-new-arrivals.webp"
        imageAlt="New Arrivals up to 50% off — festive maroon saree"
      />

      <FeatureStrip />

      <ProductGrid
        title="Newest Collection"
        subtitle="Fresh drops from this season's edit"
        items={products}
        to="/shop/saree"
      />

      <Banner
        title="Timeless Elegance"
        to="/shop/saree"
        image="/images/banner-timeless-elegance.webp"
        imageAlt="Timeless Elegance, Just For You — explore our exclusive saree collection"
      />

      <SplitFeature
        eyebrow="Ready To Wear"
        title="Ready To Wear Saree"
        description="Browse and shop your favourite drape within a minute — pre-stitched, pre-pleated and ready to slip into for any occasion."
        cta="Buy Now"
        to="/shop/saree"
        image="/images/split-ready-to-wear.webp"
        imageAlt="Ready-to-wear red saree with gold embroidery"
      />

      <SplitFeature
        eyebrow="Fabric & Feel"
        title="Cosy & Comfortable Fabric"
        description="Just because a piece is made for special occasions doesn't mean it can't be comfortable. Discover fabrics that feel as good as they look, hand-picked for every season."
        cta="Show More"
        to="/shop/kurti"
        image="/images/split-fabric-feel.webp"
        imageAlt="Ivory saree in soft, comfortable fabric"
        reverse
      />

      <Banner
        title="Bridal Beauty"
        to="/shop/saree"
        image="/images/banner-bridal-beauty.webp"
        imageAlt="Bridal Beauty — discover more with full self confidence"
      />

      <Banner
        title="Fashion That Rewards You Back"
        to="/account"
        image="/images/banner-rewards.webp"
        imageAlt="Fashion that rewards you back — shop, earn, redeem, repeat"
      />

      <LookbookStrip />
      <EntireCollectionGrid />
      <Newsletter />
    </>
  )
}
