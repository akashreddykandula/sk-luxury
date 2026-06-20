import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiUpload, FiX, FiSave, FiArrowLeft } from 'react-icons/fi'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size', 'Custom']
const COLLECTION_TYPES = ['clothing', 'jewellery', 'bridal', 'custom', 'accessories']

const initialState = {
  name: '', shortDescription: '', description: '', collectionType: 'clothing',
  category: '', price: '', salePrice: '', isOnSale: false, stock: '',
  sizes: [], fabric: '', careInstructions: '',
  material: '', weight: '', purity: '', stoneDetails: '',
  isFeatured: false, isNewArrival: false, isBestSeller: false, isTrending: false,
  tags: '', metaTitle: '', metaDescription: '',
}

export default function AdminAddProduct() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const [form, setForm] = useState(initialState)
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories))
    if (isEdit) {
      api.get(`/products/${id}`).then(r => {
        const p = r.data.product
        setForm({
          name: p.name || '', shortDescription: p.shortDescription || '',
          description: p.description || '', collectionType: p.collectionType || 'clothing',
          category: p.category?._id || '', price: p.price || '', salePrice: p.salePrice || '',
          isOnSale: p.isOnSale || false, stock: p.stock || '',
          sizes: p.sizes || [], fabric: p.fabric || '', careInstructions: p.careInstructions || '',
          material: p.material || '', weight: p.weight || '', purity: p.purity || '',
          stoneDetails: p.stoneDetails || '', isFeatured: p.isFeatured || false,
          isNewArrival: p.isNewArrival || false, isBestSeller: p.isBestSeller || false,
          isTrending: p.isTrending || false, tags: p.tags?.join(', ') || '',
          metaTitle: p.metaTitle || '', metaDescription: p.metaDescription || '',
        })
        setImages(p.images || [])
      })
    }
  }, [id])

  const handleImageUpload = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    const formData = new FormData()
    Array.from(files).forEach(f => formData.append('images', f))
    try {
      const res = await api.post('/upload/images?folder=products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const newImgs = res.data.images.map((img, i) => ({ ...img, isPrimary: images.length === 0 && i === 0 }))
      setImages(prev => [...prev, ...newImgs])
      toast.success(`${files.length} image(s) uploaded`)
    } catch { toast.error('Image upload failed') }
    finally { setUploading(false) }
  }

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx))
  const setPrimary = (idx) => setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === idx })))

  const toggleSize = (size) => setForm(f => ({
    ...f, sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
  }))

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [field]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.description || !form.collectionType) {
      toast.error('Please fill all required fields'); return
    }
    setSaving(true)
    const payload = {
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : 0,
      stock: Number(form.stock),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images,
    }
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload)
        toast.success('Product updated!')
      } else {
        await api.post('/products', payload)
        toast.success('Product created!')
      }
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product')
    } finally { setSaving(false) }
  }

  const tabs = ['basic', 'media', 'details', 'seo']

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Product' : 'Add Product'} | SK Admin</title></Helmet>

      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-3xl text-gray-800">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 w-fit">
          {tabs.map(t => (
            <button key={t} type="button" onClick={() => setActiveTab(t)}
              className={`px-5 py-2 font-sans text-xs tracking-widest uppercase transition-all ${activeTab === t ? 'bg-white shadow text-emerald-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-5">
            {activeTab === 'basic' && (
              <div className="bg-white shadow-card p-6 space-y-5">
                <h2 className="font-sans text-sm font-semibold text-gray-700 tracking-widest uppercase border-b border-gray-100 pb-3">Basic Information</h2>
                <div>
                  <label className="luxury-label">Product Name *</label>
                  <input className="luxury-input" placeholder="Enter product name" value={form.name} onChange={set('name')} required />
                </div>
                <div>
                  <label className="luxury-label">Short Description</label>
                  <input className="luxury-input" placeholder="Brief one-line description" value={form.shortDescription} onChange={set('shortDescription')} />
                </div>
                <div>
                  <label className="luxury-label">Full Description *</label>
                  <textarea className="luxury-input resize-none h-40" placeholder="Detailed product description..." value={form.description} onChange={set('description')} required />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="luxury-label">Collection Type *</label>
                    <select className="luxury-input" value={form.collectionType} onChange={set('collectionType')}>
                      {COLLECTION_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="luxury-label">Category</label>
                    <select className="luxury-input" value={form.category} onChange={set('category')}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="luxury-label">Price (₹) *</label>
                    <input type="number" className="luxury-input" placeholder="0" value={form.price} onChange={set('price')} required />
                  </div>
                  <div>
                    <label className="luxury-label">Sale Price (₹)</label>
                    <input type="number" className="luxury-input" placeholder="0" value={form.salePrice} onChange={set('salePrice')} />
                  </div>
                  <div>
                    <label className="luxury-label">Stock Quantity *</label>
                    <input type="number" className="luxury-input" placeholder="0" value={form.stock} onChange={set('stock')} required />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isOnSale" checked={form.isOnSale} onChange={set('isOnSale')} className="w-4 h-4 accent-emerald-900" />
                  <label htmlFor="isOnSale" className="font-sans text-sm text-gray-700">Mark as On Sale</label>
                </div>
                <div>
                  <label className="luxury-label">Tags (comma separated)</label>
                  <input className="luxury-input" placeholder="silk, bridal, wedding, lehenga..." value={form.tags} onChange={set('tags')} />
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="bg-white shadow-card p-6 space-y-5">
                <h2 className="font-sans text-sm font-semibold text-gray-700 tracking-widest uppercase border-b border-gray-100 pb-3">Product Images</h2>
                <label className={`flex flex-col items-center justify-center h-36 border-2 border-dashed cursor-pointer transition-colors ${uploading ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold hover:bg-gold/5'}`}>
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      <p className="font-sans text-sm text-gold">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FiUpload size={24} />
                      <p className="font-sans text-sm">Click to upload images</p>
                      <p className="font-sans text-xs text-gray-400">PNG, JPG up to 10MB each</p>
                    </div>
                  )}
                </label>
                {images.length > 0 && (
                  <div>
                    <p className="font-sans text-xs text-gray-500 mb-3">Click image to set as primary. {images.length} image(s) uploaded.</p>
                    <div className="grid grid-cols-4 gap-3">
                      {images.map((img, i) => (
                        <div key={i} className={`relative aspect-square cursor-pointer border-2 transition-all ${img.isPrimary ? 'border-gold' : 'border-transparent hover:border-gray-300'}`}
                          onClick={() => setPrimary(i)}>
                          <img src={img.url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                          {img.isPrimary && <span className="absolute top-1 left-1 bg-gold text-white font-sans text-[10px] px-1.5 py-0.5">Primary</span>}
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                            <FiX size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="bg-white shadow-card p-6 space-y-5">
                <h2 className="font-sans text-sm font-semibold text-gray-700 tracking-widest uppercase border-b border-gray-100 pb-3">Product Details</h2>
                {(form.collectionType === 'clothing' || form.collectionType === 'bridal') && (
                  <>
                    <div>
                      <label className="luxury-label">Available Sizes</label>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map(s => (
                          <button key={s} type="button" onClick={() => toggleSize(s)}
                            className={`px-4 py-2 border font-sans text-xs transition-all ${form.sizes.includes(s) ? 'border-emerald-900 bg-emerald-900 text-white' : 'border-gray-200 text-gray-600 hover:border-emerald-900'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="luxury-label">Fabric / Material</label>
                      <input className="luxury-input" placeholder="e.g., Pure Silk, Georgette, Cotton" value={form.fabric} onChange={set('fabric')} />
                    </div>
                    <div>
                      <label className="luxury-label">Care Instructions</label>
                      <textarea className="luxury-input resize-none h-24" placeholder="Dry clean only, hand wash in cold water..." value={form.careInstructions} onChange={set('careInstructions')} />
                    </div>
                  </>
                )}
                {form.collectionType === 'jewellery' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="luxury-label">Material</label>
                        <input className="luxury-input" placeholder="Gold, Silver, Platinum..." value={form.material} onChange={set('material')} />
                      </div>
                      <div>
                        <label className="luxury-label">Weight</label>
                        <input className="luxury-input" placeholder="e.g., 15 grams" value={form.weight} onChange={set('weight')} />
                      </div>
                      <div>
                        <label className="luxury-label">Purity</label>
                        <input className="luxury-input" placeholder="e.g., 22K, 18K, 925 Sterling" value={form.purity} onChange={set('purity')} />
                      </div>
                      <div>
                        <label className="luxury-label">Stone Details</label>
                        <input className="luxury-input" placeholder="Diamond, Ruby, Emerald..." value={form.stoneDetails} onChange={set('stoneDetails')} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="bg-white shadow-card p-6 space-y-5">
                <h2 className="font-sans text-sm font-semibold text-gray-700 tracking-widest uppercase border-b border-gray-100 pb-3">SEO & Meta</h2>
                <div>
                  <label className="luxury-label">Meta Title</label>
                  <input className="luxury-input" placeholder="SEO title (60 chars)" value={form.metaTitle} onChange={set('metaTitle')} maxLength={60} />
                </div>
                <div>
                  <label className="luxury-label">Meta Description</label>
                  <textarea className="luxury-input resize-none h-24" placeholder="SEO description (160 chars)" value={form.metaDescription} onChange={set('metaDescription')} maxLength={160} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white shadow-card p-5">
              <h3 className="font-sans text-xs font-semibold text-gray-600 tracking-widest uppercase mb-4">Visibility</h3>
              <div className="space-y-3">
                {[
                  { field: 'isFeatured', label: 'Featured Product' },
                  { field: 'isNewArrival', label: 'New Arrival' },
                  { field: 'isBestSeller', label: 'Best Seller' },
                  { field: 'isTrending', label: 'Trending' },
                ].map(({ field, label }) => (
                  <label key={field} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form[field]} onChange={set(field)} className="w-4 h-4 accent-emerald-900" />
                    <span className="font-sans text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving}
              className={`btn-luxury w-full justify-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {saving ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span>
              ) : (
                <span className="flex items-center gap-2"><FiSave size={15} />{isEdit ? 'Update Product' : 'Create Product'}</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
