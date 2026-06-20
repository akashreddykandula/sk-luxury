import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import api from '../../utils/api'
import { formatPrice, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, paid: 0, failed: 0, revenue: 0 })

  useEffect(() => {
    api.get('/payments/transactions')
      .then(r => {
        const txns = r.data.transactions
        setTransactions(txns)
        setStats({
          total: txns.length,
          paid: txns.filter(t => t.paymentInfo?.status === 'paid').length,
          failed: txns.filter(t => t.paymentInfo?.status === 'failed').length,
          revenue: txns.filter(t => t.paymentInfo?.status === 'paid').reduce((s, t) => s + (t.pricing?.total || 0), 0)
        })
      })
      .catch(() => toast.error('Failed to load transactions'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet><title>Transactions | SK Admin</title></Helmet>
      <h1 className="font-display text-3xl text-gray-800 mb-6">Payment Transactions</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-800' },
          { label: 'Paid', value: stats.paid, color: 'text-green-600' },
          { label: 'Failed', value: stats.failed, color: 'text-red-500' },
          { label: 'Revenue', value: formatPrice(stats.revenue), color: 'text-emerald-700' },
        ].map(s => (
          <div key={s.label} className="bg-white shadow-card p-5 text-center">
            <p className="font-sans text-xs text-gray-400 tracking-widest uppercase mb-1">{s.label}</p>
            <p className={`font-sans text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order #', 'Customer', 'Amount', 'Payment ID', 'Method', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-xs text-gray-500 tracking-widest uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>{[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>
                ))
              ) : transactions.map((t, i) => (
                <motion.tr key={t._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-sans text-xs font-semibold text-emerald-700">#{t.orderNumber}</td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-700">{t.user?.name || t.guestInfo?.name || 'Guest'}</td>
                  <td className="px-4 py-3 font-sans text-sm font-semibold text-gray-800">{formatPrice(t.pricing?.total)}</td>
                  <td className="px-4 py-3 font-sans text-[10px] text-gray-400 font-mono max-w-[100px] truncate">{t.paymentInfo?.razorpayPaymentId || '—'}</td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-600 capitalize">{t.paymentInfo?.method || 'razorpay'}</td>
                  <td className="px-4 py-3">
                    <span className={`font-sans text-[10px] px-2 py-0.5 rounded font-medium ${t.paymentInfo?.status === 'paid' ? 'bg-green-100 text-green-700' : t.paymentInfo?.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {t.paymentInfo?.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-xs text-gray-400">{formatDate(t.createdAt)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {!loading && transactions.length === 0 && (
            <div className="text-center py-12">
              <p className="font-sans text-sm text-gray-400">No transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
