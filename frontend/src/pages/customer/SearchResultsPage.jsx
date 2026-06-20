import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { FiSearch } from 'react-icons/fi'
import { fetchProducts } from '../../store/slices/productSlice'
import ProductGrid from '../../components/product/ProductGrid'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const dispatch = useDispatch()
  const { items, loading, pagination } = useSelector(s => s.products)

  useEffect(() => {
    if (q) dispatch(fetchProducts({ search: q, limit: 12 }))
  }, [q])

  return (
    <>
      <Helmet><title>Search: {q} | SK Luxury</title></Helmet>
      <div className="bg-luxury-beige/50 border-b border-gray-100 py-8">
        <div className="page-container text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FiSearch size={20} className="text-gold" />
            <h1 className="font-display text-3xl text-luxury-dark">Search Results</h1>
          </div>
          <p className="font-sans text-sm text-luxury-muted">
            {loading ? 'Searching...' : `${pagination?.total || 0} results for "${q}"`}
          </p>
        </div>
      </div>
      <div className="page-container section-padding">
        <ProductGrid products={items} loading={loading} emptyMessage={`No results found for "${q}"`} />
      </div>
    </>
  )
}
