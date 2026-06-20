import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../store/slices/productSlice'
import { formatPrice, getImageUrl } from '../../utils/helpers'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { items, loading, pagination } = useSelector(s => s.products)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [collectionType, setCollectionType] = useState('')

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 15, search: search || undefined, collectionType: collectionType || undefined }))
  }, [page, collectionType])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(fetchProducts({ page: 1, limit: 15, search: search || undefined }))
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      dispatch(fetchProducts({ page, limit: 15 }))
    } catch { toast.error('Failed to delete product') }
  }

  return (
    <>
      <Helmet><title>Products | SK Admin</title></Helmet>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-gray-800">Products</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">{pagination?.total || 0} total products</p>
        </div>
        <Link to="/admin/products/add" className="btn-luxury flex items-center gap-2">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-card p-4 mb-6 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-48">
          <div className="relative flex-1">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 font-sans text-sm focus:outline-none focus:border-gold" />
          </div>
          <button type="submit" className="btn-luxury px-4 py-2.5 text-xs">Search</button>
        </form>
        <select value={collectionType} onChange={e => { setCollectionType(e.target.value); setPage(1) }}
          className="border border-gray-200 px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-gold bg-white">
          <option value="">All Collections</option>
          <option value="clothing">Clothing</option>
          <option value="jewellery">Jewellery</option>
          <option value="bridal">Bridal</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : items.map((product, i) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-luxury-beige overflow-hidden shrink-0">
                        <img src={getImageUrl(product.images)} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-sans text-sm text-gray-800 font-medium line-clamp-1 max-w-[200px]">{product.name}</p>
                        <p className="font-sans text-xs text-gray-400">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-600 capitalize">{product.collectionType}</td>
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm font-semibold text-gray-800">{formatPrice(product.isOnSale && product.salePrice ? product.salePrice : product.price)}</p>
                    {product.isOnSale && product.salePrice && (
                      <p className="font-sans text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-xs font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {product.isFeatured && <span className="font-sans text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 inline-block">Featured</span>}
                      {product.isNewArrival && <span className="font-sans text-[10px] bg-green-100 text-green-700 px-2 py-0.5 inline-block">New</span>}
                      {product.isBestSeller && <span className="font-sans text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 inline-block">Best Seller</span>}
                      {!product.isFeatured && !product.isNewArrival && !product.isBestSeller && (
                        <span className="font-sans text-[10px] text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/product/${product.slug || product._id}`} target="_blank"
                        className="p-2 text-gray-400 hover:text-emerald-700 transition-colors" title="View">
                        <FiEye size={15} />
                      </Link>
                      <Link to={`/admin/products/edit/${product._id}`}
                        className="p-2 text-gray-400 hover:text-gold transition-colors" title="Edit">
                        <FiEdit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(product._id, product.name)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 font-sans text-sm border transition-all ${page === i + 1 ? 'bg-emerald-900 text-white border-emerald-900' : 'border-gray-200 text-gray-500 hover:border-gold hover:text-gold'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
