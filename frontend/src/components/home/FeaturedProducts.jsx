import React from 'react'
import SectionHeader from '../common/SectionHeader'
import ProductGrid from '../product/ProductGrid'

export default function FeaturedProducts({ products }) {
  return (
    <section className="section-padding bg-white">
      <div className="page-container">
        <SectionHeader
          eyebrow="Hand Picked"
          title="Featured Collection"
          subtitle="Curated pieces that define luxury and elegance"
          linkTo="/collections"
          linkLabel="View All Collections"
        />
        <ProductGrid products={products} loading={!products.length && false} />
      </div>
    </section>
  )
}
