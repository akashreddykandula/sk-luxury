import React from 'react'
import ProductCard from './ProductCard'

const SkeletonCard = () => (
  <div className="bg-white">
    <div className="skeleton aspect-[3/4] w-full" />
    <div className="p-4 space-y-2">
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-5 w-1/4 rounded" />
    </div>
  </div>
)

export default function ProductGrid({ products = [], loading = false, columns = 4, emptyMessage = 'No products found' }) {
  const gridClass = {
    2: 'grid-cols-2 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  }[columns] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-4 md:gap-6`}>
        {[...Array(columns * 2)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-2xl text-luxury-dark mb-2">{emptyMessage}</p>
        <p className="font-sans text-sm text-luxury-muted">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridClass} gap-4 md:gap-6`}>
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} index={i} />
      ))}
    </div>
  )
}
