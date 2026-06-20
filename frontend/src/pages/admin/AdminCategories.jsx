import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', description: '', sortOrder: 0 })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const r = await api.get('/categories')
      setCategories(r.data.categories)
    } catch { toast.error('Failed to load categories') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Category name is required'); return }
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/categories/${editing}`, form)
        toast.success('Category updated!')
        setEditing(null)
      } else {
        await api.post('/categories', form)
        toast.success('Category created!')
      }
      setForm({ name: '', description: '', sortOrder: 0 })
      fetch()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleEdit = (cat) => {
    setEditing(cat._id)
    setForm({ name: cat.name, description: cat.description || '', sortOrder: cat.sortOrder || 0 })
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Category deleted')
      fetch()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <>
      <Helmet><title>Categories | SK Admin</title></Helmet>
      <h1 className="font-display text-3xl text-gray-800 mb-6">Categories</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white shadow-card p-6">
          <h2 className="font-sans text-sm font-semibold text-gray-700 tracking-widest uppercase mb-5 flex items-center justify-between">
            {editing ? 'Edit Category' : 'Add Category'}
            {editing && (
              <button onClick={() => { setEditing(null); setForm({ name: '', description: '', sortOrder: 0 }) }}
                className="p-1 text-gray-400 hover:text-gray-700"><FiX size={16} /></button>
            )}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="luxury-label">Category Name *</label>
              <input className="luxury-input" placeholder="e.g., Lehengas, Sarees, Necklaces"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="luxury-label">Description</label>
              <textarea className="luxury-input resize-none h-20" placeholder="Category description..."
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="luxury-label">Sort Order</label>
              <input type="number" className="luxury-input" value={form.sortOrder}
                onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
            </div>
            <button type="submit" disabled={saving} className={`btn-luxury w-full justify-center ${saving ? 'opacity-70' : ''}`}>
              <FiSave size={14} /> {editing ? 'Update' : 'Create'} Category
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white shadow-card">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-sans text-sm font-semibold text-gray-700 tracking-widest uppercase">
              All Categories ({categories.length})
            </h2>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {categories.map((cat, i) => (
                <motion.div key={cat._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-sans text-sm font-medium text-gray-800">{cat.name}</p>
                    <p className="font-sans text-xs text-gray-400">/{cat.slug} · Sort: {cat.sortOrder}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-gold transition-colors"><FiEdit2 size={15} /></button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 size={15} /></button>
                  </div>
                </motion.div>
              ))}
              {categories.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-sans text-sm text-gray-400">No categories yet. Create your first category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
