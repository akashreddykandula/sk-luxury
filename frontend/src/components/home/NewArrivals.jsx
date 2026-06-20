import React from 'react'
import SectionHeader from '../common/SectionHeader'
import ProductGrid from '../product/ProductGrid'

export default function NewArrivals({ products }) {
  return (
    <section className="section-padding bg-luxury-cream">
      <div className="page-container">
        <SectionHeader
          eyebrow="Just Arrived"
          title="New Arrivals"
          subtitle="Fresh styles added every week – be the first to discover"
          linkTo="/collections"
          linkLabel="See All New Arrivals"
        />
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
