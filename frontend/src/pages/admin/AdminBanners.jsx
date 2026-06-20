import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiPlus, FiTrash2, FiSave, FiUpload, FiX } from 'react-icons/fi'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', subtitle: '', buttonText: '', buttonLink: '', position: 'hero', sortOrder: 0, image: '', publicId: '' })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try { const r = await api.get('/banners/all'); setBanners(r.data.banners) }
    catch { toast.error('Failed to load banners') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    try {
      const r = await api.post('/upload/image?folder=banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm(f => ({ ...f, image: r.data.url, publicId: r.data.publicId }))
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.image) { toast.error('Title and image are required'); return }
    setSaving(true)
    try {
      await api.post('/banners', form)
      toast.success('Banner created!')
      setForm({ title: '', subtitle: '', buttonText: '', buttonLink: '', position: 'hero', sortOrder: 0, image: '', publicId: '' })
      fetch()
    } catch { toast.error('Failed to create banner') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return
    try { await api.delete(`/banners/${id}`); toast.success('Banner deleted'); fetch() }
    catch { toast.error('Failed to delete') }
  }

  const toggleActive = async (id, isActive) => {
    try { await api.put(`/banners/${id}`, { isActive: !isActive }); fetch() }
    catch { toast.error('Failed to update') }
  }

  return (
    <>
      <Helmet><title>Banners | SK Admin</title></Helmet>
      <h1 className="font-display text-3xl text-gray-800 mb-6">Homepage Banners</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white shadow-card p-6">
          <h2 className="font-sans text-sm font-semibold text-gray-700 tracking-widest uppercase mb-5">Add New Banner</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="luxury-label">Title *</label>
              <input className="luxury-input" placeholder="Banner headline" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <label className="luxury-label">Subtitle</label>
              <input className="luxury-input" placeholder="Supporting text" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="luxury-label">Button Text</label>
                <input className="luxury-input" placeholder="Shop Now" value={form.buttonText} onChange={e => setForm(f => ({ ...f, buttonText: e.target.value }))} />
              </div>
              <div>
                <label className="luxury-label">Button Link</label>
                <input className="luxury-input" placeholder="/collections" value={form.buttonLink} onChange={e => setForm(f => ({ ...f, buttonLink: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="luxury-label">Position</label>
              <select className="luxury-input" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}>
                <option value="hero">Hero Slider</option>
                <option value="featured">Featured Section</option>
                <option value="promo">Promo Banner</option>
              </select>
            </div>
            <div>
              <label className="luxury-label">Banner Image *</label>
              <label className={`flex flex-col items-center justify-center h-28 border-2 border-dashed cursor-pointer transition-colors ${uploading ? 'border-gold' : 'border-gray-200 hover:border-gold'}`}>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                ) : form.image ? (
                  <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <FiUpload size={20} />
                    <p className="font-sans text-xs">Upload banner image</p>
                  </div>
                )}
              </label>
            </div>
            <button type="submit" disabled={saving || uploading} className={`btn-luxury w-full justify-center ${(saving || uploading) ? 'opacity-70' : ''}`}>
              <FiSave size={14} /> Save Banner
            </button>
          </form>
        </div>

        {/* Banner list */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="skeleton h-32 rounded" />)
          ) : banners.length === 0 ? (
            <div className="bg-white shadow-card p-12 text-center">
              <p className="font-sans text-sm text-gray-400">No banners yet. Create your first banner.</p>
            </div>
          ) : (
            banners.map((banner, i) => (
              <motion.div key={banner._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white shadow-card overflow-hidden flex">
                <div className="w-40 shrink-0">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-sans text-sm font-semibold text-gray-800">{banner.title}</h3>
                      <span className={`font-sans text-[10px] px-2 py-0.5 shrink-0 ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {banner.subtitle && <p className="font-sans text-xs text-gray-500 mt-1">{banner.subtitle}</p>}
                    <p className="font-sans text-xs text-gold mt-1 capitalize">Position: {banner.position}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(banner._id, banner.isActive)}
                      className="font-sans text-xs border border-gray-200 px-3 py-1.5 hover:border-gold hover:text-gold transition-colors">
                      {banner.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(banner._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
