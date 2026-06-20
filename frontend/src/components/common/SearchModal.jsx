import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi'
import { closeSearch } from '../../store/slices/uiSlice'
import { searchProducts } from '../../store/slices/productSlice'
import { formatPrice, getImageUrl } from '../../utils/helpers'

export default function SearchModal() {
  const dispatch = useDispatch()
  const { searchOpen } = useSelector(s => s.ui)
  const { searchResults, searchLoading } = useSelector(s => s.products)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100)
    else setQuery('')
  }, [searchOpen])

  useEffect(() => {
    if (query.length < 2) return
    const timer = setTimeout(() => dispatch(searchProducts(query)), 400)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') dispatch(closeSearch()) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={(e) => e.target === e.currentTarget && dispatch(closeSearch())}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-2xl bg-white shadow-luxury-lg"
          >
            {/* Search input */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
              <FiSearch size={20} className="text-gold shrink-0" />
              <input
                ref={inputRef}
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search for clothing, jewellery, bridal collections..."
                className="flex-1 font-sans text-base text-luxury-dark placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button onClick={() => dispatch(closeSearch())} className="p-1 text-luxury-muted hover:text-luxury-dark">
                <FiX size={20} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchLoading && (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!searchLoading && query.length >= 2 && searchResults.length === 0 && (
                <div className="text-center py-10">
                  <p className="font-sans text-sm text-luxury-muted">No products found for "{query}"</p>
                </div>
              )}
              {!searchLoading && searchResults.length > 0 && (
                <div>
                  <p className="px-6 py-3 font-sans text-xs text-luxury-muted tracking-widest uppercase border-b border-gray-100">
                    {searchResults.length} Results
                  </p>
                  {searchResults.map(product => (
                    <Link
                      key={product._id}
                      to={`/product/${product.slug || product._id}`}
                      onClick={() => dispatch(closeSearch())}
                      className="flex items-center gap-4 px-6 py-3 hover:bg-luxury-beige transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="w-12 h-14 bg-luxury-beige overflow-hidden shrink-0">
                        <img src={getImageUrl(product.images)} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm text-luxury-dark font-medium truncate">{product.name}</p>
                        <p className="font-sans text-xs text-luxury-muted">{product.category?.name}</p>
                      </div>
                      <div className="text-right">
                        {product.isOnSale && product.salePrice ? (
                          <div>
                            <p className="font-sans text-sm font-semibold text-emerald-900">{formatPrice(product.salePrice)}</p>
                            <p className="font-sans text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                          </div>
                        ) : (
                          <p className="font-sans text-sm font-semibold text-emerald-900">{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                  <Link
                    to={`/search?q=${query}`} onClick={() => dispatch(closeSearch())}
                    className="flex items-center justify-center gap-2 py-4 font-sans text-sm text-gold hover:text-gold-600 transition-colors border-t border-gray-100"
                  >
                    View all results for "{query}" <FiArrowRight size={14} />
                  </Link>
                </div>
              )}
              {!query && (
                <div className="px-6 py-6">
                  <p className="font-sans text-xs text-luxury-muted tracking-widest uppercase mb-4">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Bridal Lehenga', 'Gold Jewellery', 'Silk Saree', 'Designer Kurti', 'Necklace Set', 'Anarkali'].map(t => (
                      <button key={t} onClick={() => setQuery(t)}
                        className="px-4 py-2 border border-gray-200 font-sans text-sm text-luxury-muted hover:border-gold hover:text-gold transition-colors">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
