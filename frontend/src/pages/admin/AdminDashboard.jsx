import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiPackage, FiShoppingBag, FiDollarSign, FiUsers, FiArrowRight, FiTrendingUp } from 'react-icons/fi'
import api from '../../utils/api'
import { formatPrice, formatDate, statusColor } from '../../utils/helpers'

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-white rounded-none shadow-card p-6 border-l-4 flex items-center gap-5"
    style={{ borderLeftColor: color }}
  >
    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <p className="font-sans text-xs text-gray-500 tracking-widest uppercase">{label}</p>
      <p className="font-sans text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      {sub && <p className="font-sans text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
)

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setData(r.data.dashboard))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded" />)}
      </div>
    </div>
  )

  return (
    <>
      <Helmet><title>Dashboard | SK Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-gray-800">Dashboard</h1>
        <p className="font-sans text-sm text-gray-500 mt-1">Welcome back! Here's what's happening at SK Luxury.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiPackage} label="Total Products" value={data?.totalProducts || 0} color="#0d3b2e" delay={0} />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={data?.totalOrders || 0} sub={`${data?.pendingOrders || 0} pending`} color="#C9A84C" delay={0.05} />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={formatPrice(data?.totalRevenue || 0)} color="#0f766e" delay={0.1} />
        <StatCard icon={FiUsers} label="Customers" value={data?.totalUsers || 0} color="#7c3aed" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white shadow-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-sans text-sm font-semibold text-gray-700 tracking-widest uppercase">Recent Orders</h2>
            <Link to="/admin/orders" className="flex items-center gap-1 font-sans text-xs text-emerald-700 hover:text-gold transition-colors">
              View All <FiArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  {['Order #', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-sans text-xs text-gray-500 tracking-widest uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.recentOrders?.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-sans text-xs text-emerald-700 font-medium">#{order.orderNumber}</td>
                    <td className="px-4 py-3 font-sans text-xs text-gray-700">{order.user?.name || order.guestInfo?.name || 'Guest'}</td>
                    <td className="px-4 py-3 font-sans text-xs font-semibold text-gray-800">{formatPrice(order.pricing?.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded font-sans text-[10px] uppercase font-medium ${statusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-gray-400">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white shadow-card">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-sans text-sm font-semibold text-gray-700 tracking-widest uppercase flex items-center gap-2">
              <FiTrendingUp size={14} className="text-gold" /> Top Products
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {data?.topProducts?.map((product, i) => (
              <div key={product._id} className="flex items-center gap-3">
                <span className="font-sans text-xs text-gray-400 w-4">{i + 1}</span>
                <div className="w-10 h-12 bg-luxury-beige overflow-hidden shrink-0">
                  <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs text-gray-700 font-medium truncate">{product.name}</p>
                  <p className="font-sans text-xs text-gray-400">{product.soldCount} sold · {formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
            {(!data?.topProducts || data.topProducts.length === 0) && (
              <p className="font-sans text-xs text-gray-400 text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
