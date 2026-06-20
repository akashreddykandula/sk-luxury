import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/users')
      .then(r => setUsers(r.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/toggle`)
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u))
      toast.success('User status updated')
    } catch { toast.error('Failed to update') }
  }

  return (
    <>
      <Helmet><title>Customers | SK Admin</title></Helmet>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-gray-800">Customers</h1>
        <p className="font-sans text-sm text-gray-500 mt-1">{users.length} registered customers</p>
      </div>

      <div className="bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Customer', 'Email', 'Phone', 'Wishlist', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>{[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>
                ))
              ) : users.map((user, i) => (
                <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 flex items-center justify-center shrink-0">
                        <span className="font-display text-emerald-800 text-sm font-semibold">{user.name?.charAt(0)}</span>
                      </div>
                      <p className="font-sans text-sm font-medium text-gray-800">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-600">{user.phone || '—'}</td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-500">{user.wishlist?.length || 0} items</td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-400">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[10px] px-2 py-0.5 rounded ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(user._id)}
                      className="font-sans text-xs text-gray-400 hover:text-gold transition-colors border border-gray-200 px-2 py-1 hover:border-gold">
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="font-sans text-sm text-gray-400">No customers yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
