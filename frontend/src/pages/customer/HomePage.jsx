import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeatured, fetchNewArrivals, fetchBestSellers } from '../../store/slices/productSlice'
import HeroSection from '../../components/home/HeroSection'
import CollectionBanner from '../../components/home/CollectionBanner'
import FeaturedProducts from '../../components/home/FeaturedProducts'
import NewArrivals from '../../components/home/NewArrivals'
import BestSellers from '../../components/home/BestSellers'
import BrandStory from '../../components/home/BrandStory'
import WhyChooseUs from '../../components/home/WhyChooseUs'
import Testimonials from '../../components/home/Testimonials'
import InstagramGallery from '../../components/home/InstagramGallery'
import BridalBanner from '../../components/home/BridalBanner'
import CollectionGrid from '../../components/home/CollectionGrid'

export default function HomePage() {
  const dispatch = useDispatch()
  const { featured, newArrivals, bestSellers } = useSelector(s => s.products)

  useEffect(() => {
    dispatch(fetchFeatured())
    dispatch(fetchNewArrivals())
    dispatch(fetchBestSellers())
  }, [dispatch])

  return (
    <>
      <Helmet>
        <title>SK – Luxury in Every Stitch | Premium Boutique</title>
        <meta name="description" content="Discover SK Luxury – Premium Clothing, Designer Jewellery, Bridal Collections & Custom Boutique Designs. Luxury in Every Stitch." />
      </Helmet>
      <HeroSection />
      <CollectionGrid />
      <FeaturedProducts products={featured} />
      <BridalBanner />
      <NewArrivals products={newArrivals} />
      <CollectionBanner />
      <BestSellers products={bestSellers} />
      <BrandStory />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
    </>
  )
}
