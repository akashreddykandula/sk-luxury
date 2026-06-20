import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { getProfile } from '../../store/slices/authSlice'
import ProductGrid from '../../components/product/ProductGrid'

export default function WishlistPage() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)

  useEffect(() => { dispatch(getProfile()) }, [])

  const wishlistProducts = user?.wishlist || []

  return (
    <>
      <Helmet><title>Wishlist | SK Luxury</title></Helmet>
      <div className="bg-luxury-beige/50 border-b border-gray-100 py-8">
        <div className="page-container flex items-center gap-3">
          <FiHeart size={20} className="text-gold" />
          <h1 className="font-display text-3xl text-luxury-dark">My Wishlist</h1>
          <span className="font-sans text-sm text-luxury-muted">({wishlistProducts.length} items)</span>
        </div>
      </div>
      <div className="page-container section-padding">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <FiHeart size={56} className="text-gray-200 mx-auto mb-4" />
            <p className="font-display text-2xl text-luxury-dark mb-2">Your wishlist is empty</p>
            <p className="font-sans text-sm text-luxury-muted mb-8">Save your favourite items here</p>
            <Link to="/collections" className="btn-luxury">Explore Collections</Link>
          </div>
        ) : (
          <ProductGrid products={wishlistProducts} />
        )}
      </div>
    </>
  )
}
