import React, { useEffect, useState } from 'react'
import api from '../../utils/api'
import SectionHeader from '../common/SectionHeader'
import ProductGrid from './ProductGrid'

export default function RelatedProducts({ categoryId, collectionType, excludeId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!excludeId) return
    setLoading(true)
    const params = { limit: 5 }
    if (categoryId) params.category = categoryId
    else if (collectionType) params.collectionType = collectionType

    api.get('/products', { params })
      .then(res => setProducts(res.data.products.filter(p => p._id !== excludeId).slice(0, 4)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [categoryId, collectionType, excludeId])

  if (!loading && products.length === 0) return null

  return (
    <section className="section-padding bg-white">
      <div className="page-container">
        <SectionHeader eyebrow="Curated For You" title="You May Also Like" center={false} />
        <ProductGrid products={products} loading={loading} columns={4} />
      </div>
    </section>
  )
}
