import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiFilter } from 'react-icons/fi'
import { fetchProducts } from '../../store/slices/productSlice'
import ProductGrid from '../../components/product/ProductGrid'
import SectionHeader from '../../components/common/SectionHeader'
import api from '../../utils/api';


const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export function CollectionPageBase({ title, subtitle, eyebrow, collectionType, heroImage, bgColor = 'bg-luxury-cream' }) {
  const dispatch = useDispatch()
  const { items, loading, pagination } = useSelector(s => s.products)
  const [showFilters, setShowFilters] = useState(false)
const [categories, setCategories] = useState ([]);

const [filters, setFilters] = useState ({
  minPrice: '',
  maxPrice: '',
  sizes: [],
  category: '',
  sort: 'newest',
  page: 1,
});
useEffect (() => {
  api
    .get ('/categories')
    .then (res => setCategories (res.data.categories))
    .catch (console.error);
}, []);


  useEffect(() => {
    const params = { limit: 12, page: filters.page, sort: filters.sort 
      
    }
    if (filters.category) {
  params.category = filters.category;
}

    if (collectionType) params.collectionType = collectionType
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.sizes.length) params.sizes = filters.sizes.join(',')
    dispatch(fetchProducts(params))
  }, [filters, collectionType])

  const toggleSize = (s) => setFilters(f => ({
    ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s], page: 1
  }))

  return (
    <>
      <Helmet>
        <title>{title} | SK Luxury</title>
        <meta name="description" content={subtitle} />
      </Helmet>

      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={heroImage} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-emerald-950/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="section-subtitle text-gold/90">{eyebrow}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl md:text-6xl text-white">{title}</motion.h1>
          {subtitle && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="font-sans text-white/70 mt-3 max-w-md text-sm">{subtitle}</motion.p>}
        </div>
      </div>

      <div className={`${bgColor} min-h-screen`}>
        <div className="page-container py-10">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <p className="font-sans text-sm text-luxury-muted">
              {loading ? 'Loading...' : `${pagination?.total || 0} Products`}
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border border-gray-200 px-4 py-2.5 font-sans text-xs tracking-widest uppercase hover:border-gold hover:text-gold transition-colors">
                <FiFilter size={13} /> {showFilters ? 'Hide' : 'Show'} Filters
              </button>
              <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 1 }))}
                className="border border-gray-200 px-4 py-2.5 font-sans text-xs text-luxury-dark bg-white focus:outline-none focus:border-gold cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters sidebar */}
            {showFilters && (
              <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-56 shrink-0">
                <div className="sticky top-24 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans text-xs tracking-widest uppercase text-luxury-dark font-semibold">Filters</h3>

                    <button onClick={() =>
  setFilters({
    minPrice: '',
    maxPrice: '',
    sizes: [],
    category: '',
    sort: 'newest',
    page: 1
  })
}
                      className="font-sans text-xs text-gold hover:text-gold-600 transition-colors">Clear All</button>
                  </div>
{
  /* Category */
}
<div>
  <h4 className="font-sans text-xs tracking-widest uppercase text-luxury-muted mb-3">
    Category
  </h4>

  <select
    value={filters.category}
    onChange={e =>
      setFilters (f => ({
        ...f,
        category: e.target.value,
        page: 1,
      }))}
    className="w-full px-3 py-2 border border-gray-200 font-sans text-xs focus:outline-none focus:border-gold"
  >
    <option value="">All Categories</option>

    {categories.map (cat => (
      <option key={cat._id} value={cat._id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>

                  {/* Price */}
                  <div>
                    <h4 className="font-sans text-xs tracking-widest uppercase text-luxury-muted mb-3">Price Range</h4>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" value={filters.minPrice}
                        onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value, page: 1 }))}
                        className="w-full px-3 py-2 border border-gray-200 font-sans text-xs focus:outline-none focus:border-gold" />
                      <input type="number" placeholder="Max" value={filters.maxPrice}
                        onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value, page: 1 }))}
                        className="w-full px-3 py-2 border border-gray-200 font-sans text-xs focus:outline-none focus:border-gold" />
                    </div>
                  </div>

                  {/* Sizes */}
                  {(collectionType === 'clothing' || collectionType === 'bridal' || !collectionType) && (
                    <div>
                      <h4 className="font-sans text-xs tracking-widest uppercase text-luxury-muted mb-3">Size</h4>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map(s => (
                          <button key={s} onClick={() => toggleSize(s)}
                            className={`px-3 py-1.5 border font-sans text-xs transition-all ${filters.sizes.includes(s) ? 'border-emerald-900 bg-emerald-900 text-white' : 'border-gray-200 text-luxury-muted hover:border-emerald-900'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.aside>
            )}

            {/* Products */}
            <div className="flex-1 min-w-0">
              <ProductGrid products={items} loading={loading} columns={showFilters ? 3 : 4} />

              {/* Pagination */}
              {pagination?.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                      className={`w-10 h-10 font-sans text-sm border transition-all ${filters.page === i + 1 ? 'bg-emerald-900 text-white border-emerald-900' : 'border-gray-200 text-luxury-muted hover:border-gold hover:text-gold'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Default export: All Collections page
export default function CollectionsPage() {
  return (
    <CollectionPageBase
      title="All Collections"
      eyebrow="Explore"
      subtitle="Discover our complete range of luxury fashion and jewellery"
      heroImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80"
    />
  )
}
