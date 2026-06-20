import React from 'react'
import { useSelector } from 'react-redux'
import SectionHeader from '../common/SectionHeader'
import ProductGrid from './ProductGrid'

export default function RecentlyViewed({ excludeId }) {
  const { items } = useSelector(s => s.recentlyViewed)
  const filtered = items.filter(p => p._id !== excludeId)

  if (filtered.length === 0) return null

  return (
    <section className="section-padding bg-luxury-cream border-t border-gray-100">
      <div className="page-container">
        <SectionHeader eyebrow="Continue Browsing" title="Recently Viewed" center={false} />
        <ProductGrid products={filtered.slice(0, 4)} columns={4} />
      </div>
    </section>
  )
}
