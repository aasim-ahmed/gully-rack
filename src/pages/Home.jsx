import Seo from '../components/common/Seo'
import Hero from '../components/home/Hero'
import BrandStatement from '../components/home/BrandStatement'
import CategoryEditorial from '../components/home/CategoryEditorial'
import FeaturedDrop from '../components/home/FeaturedDrop'
import Campaign from '../components/home/Campaign'
import ProductRail from '../components/home/ProductRail'
import BrandCulture from '../components/home/BrandCulture'
import SocialGallery from '../components/home/SocialGallery'
import { getNewArrivals } from '../data/products'
import { HERO_IMAGE } from '../data/site'

const NEW_ARRIVALS = getNewArrivals(12)

export default function Home() {
  return (
    <>
      <Seo
        description="GULLY RACK — curated streetwear and essentials. Shop graded pre-loved finds and new basics: tees, hoodies, jackets, denim and accessories, shipped across India."
        image={`${HERO_IMAGE}?w=1200&q=80`}
      />
      <Hero />
      <BrandStatement />
      <CategoryEditorial />
      <FeaturedDrop />
      <Campaign />
      <ProductRail
        label="(05) — New arrivals"
        title="Fresh off"
        accent="the rack."
        products={NEW_ARRIVALS}
        action={{ label: 'Shop new in', to: '/shop?collection=new' }}
      />
      <BrandCulture />
      <SocialGallery />
    </>
  )
}
