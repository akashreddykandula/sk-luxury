import React from 'react'
import SectionHeader from '../common/SectionHeader'
import ProductGrid from '../product/ProductGrid'

export default function BestSellers({ products }) {
  return (
    <section className="section-padding bg-white">
      <div className="page-container">
        <SectionHeader eyebrow="Most Loved" title="Best Sellers" subtitle="Our most cherished pieces, loved by thousands" linkTo="/collections" linkLabel="Shop All" />
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
