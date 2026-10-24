import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiClient } from '../../api/client'
import { uploadFileToS3 } from '../../utils/s3Upload'
import { useAdminTheme } from '../../context/AdminThemeContext'
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  UploadCloud, 
  Loader2, 
  Check, 
  AlertCircle, 
  Filter, 
  Package, 
  Layers, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react'

const FALLBACK_CATEGORIES = [
  { _id: 'silk-saree', id: 'silk-saree', slug: 'silk-saree', name: 'Silk Saree' },
  { _id: 'bridal-saree', id: 'bridal-saree', slug: 'bridal-saree', name: 'Bridal Saree' },
  { _id: 'partywear', id: 'partywear', slug: 'partywear', name: 'Partywear Saree' },
  { _id: 'saree', id: 'saree', slug: 'saree', name: 'All Sarees' },
  { _id: 'organza-saree', id: 'organza-saree', slug: 'organza-saree', name: 'Organza Saree' },
  { _id: 'cotton-saree', id: 'cotton-saree', slug: 'cotton-saree', name: 'Cotton Saree' },
  { _id: 'georgette-saree', id: 'georgette-saree', slug: 'georgette-saree', name: 'Georgette Saree' },
  { _id: 'kurti', id: 'kurti', slug: 'kurti', name: 'Kurti' },
  { _id: 'lehenga', id: 'lehenga', slug: 'lehenga', name: 'Lehenga' }
]

export default function AdminProducts() {
  const { isDarkMode } = useAdminTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successToast, setSuccessToast] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [stockFilter, setStockFilter] = useState('ALL') // 'ALL' | 'LOW' | 'OUT'

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addError, setAddError] = useState(null)
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    sku: '',
    fabric: '',
    color: '',
    isBestseller: false,
  })
  const [addSelectedFiles, setAddSelectedFiles] = useState([])
  const [addPreviewUrls, setAddPreviewUrls] = useState([])
  const [addCustomUrl, setAddCustomUrl] = useState('')
  const [addCustomUrls, setAddCustomUrls] = useState([])
  const [isAddSubmitting, setIsAddSubmitting] = useState(false)

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null)
  const [editError, setEditError] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    compareAtPrice: '',
    stock: '',
    sku: '',
    fabric: '',
    color: '',
    isBestseller: false,
  })
  const [editExistingImages, setEditExistingImages] = useState([])
  const [editNewFiles, setEditNewFiles] = useState([])
  const [editNewPreviewUrls, setEditNewPreviewUrls] = useState([])
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)

  const openAddModal = () => {
    const activeCats = categories.length > 0 ? categories : FALLBACK_CATEGORIES
    const defaultCat = activeCats[0]._id || activeCats[0].id
    setAddForm(prev => ({
      ...prev,
      category: prev.category || defaultCat
    }))
    setAddError(null)
    setIsAddOpen(true)
  }

  // Check if opened with ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal()
      searchParams.delete('action')
      setSearchParams(searchParams, { replace: true })
    }
    const s = searchParams.get('search')
    if (s) {
      setSearchQuery(s)
    }
  }, [searchParams, setSearchParams])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [prodRes, catRes] = await Promise.all([
        apiClient.get('/sarees?limit=200'),
        apiClient.get('/categories')
      ])
      const items = prodRes.data?.items || (Array.isArray(prodRes.data) ? prodRes.data : [])
      setProducts(items)
      const fetchedCats = catRes.data?.categories || catRes.data || []
      setCategories(Array.isArray(fetchedCats) && fetchedCats.length > 0 ? fetchedCats : FALLBACK_CATEGORIES)
    } catch (err) {
      setError(err.message || 'Failed to load products')
      setCategories(FALLBACK_CATEGORIES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const showToast = (msg) => {
    setSuccessToast(msg)
    setTimeout(() => {
      setSuccessToast(null)
    }, 4000)
  }

  // --- ADD PRODUCT LOGIC ---
  const handleAddFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setAddSelectedFiles(prev => [...prev, ...files])
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setAddPreviewUrls(prev => [...prev, ...newPreviews])
    setAddError(null)
  }

  const removeAddImage = (index) => {
    URL.revokeObjectURL(addPreviewUrls[index])
    setAddPreviewUrls(prev => prev.filter((_, i) => i !== index))
    setAddSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setAddError(null)

    if (!addForm.name.trim()) {
      setAddError('Product title is required')
      return
    }

    const effectiveCategory = addForm.category || (categories[0]?._id || categories[0]?.id || FALLBACK_CATEGORIES[0]._id)
    if (!effectiveCategory) {
      setAddError('Please select a valid product category')
      return
    }

    if (!addForm.price || Number(addForm.price) <= 0) {
      setAddError('Please enter a valid price (greater than ₹0)')
      return
    }

    const totalImagesCount = addSelectedFiles.length + addCustomUrls.length
    if (totalImagesCount === 0) {
      setAddError('Please upload at least one image or provide an image URL.')
      return
    }

    try {
      setIsAddSubmitting(true)
      let uploadedUrls = []
      if (addSelectedFiles.length > 0) {
        const uploadPromises = addSelectedFiles.map(file => uploadFileToS3(file))
        uploadedUrls = await Promise.all(uploadPromises)
      }

      const allImages = [...uploadedUrls, ...addCustomUrls.filter(Boolean)]

      const payload = {
        name: addForm.name.trim(),
        description: addForm.description.trim() || `${addForm.name.trim()} - Premium Saree collection`,
        category: effectiveCategory,
        price: Number(addForm.price),
        compareAtPrice: addForm.compareAtPrice ? Number(addForm.compareAtPrice) : undefined,
        stock: Number(addForm.stock || 0),
        sku: (addForm.sku.trim() || `VT-${Date.now().toString().slice(-4)}`).toUpperCase(),
        fabric: addForm.fabric.trim() || 'Silk',
        color: addForm.color.trim() || 'Multicolor',
        isBestseller: Boolean(addForm.isBestseller),
        images: allImages
      }

      const res = await apiClient.post('/sarees', payload)
      if (!res?.success && res?.data?.success === false) {
        throw new Error(res?.message || res?.data?.message || 'Failed to create product')
      }

      setIsAddOpen(false)
      setAddForm({
        name: '', description: '', category: '', price: '', compareAtPrice: '',
        stock: '', sku: '', fabric: '', color: '', isBestseller: false
      })
      setAddSelectedFiles([])
      setAddPreviewUrls([])
      setAddCustomUrls([])
      setAddCustomUrl('')
      setAddError(null)
      fetchData()
      showToast('Product created successfully!')
    } catch (err) {
      console.error('Failed to create product:', err)
      const msg = err.data?.message || err.message || 'Failed to create product'
      setAddError(msg)
    } finally {
      setIsAddSubmitting(false)
    }
  }

  // --- EDIT PRODUCT LOGIC ---
  const openEditModal = (prod) => {
    setEditingProduct(prod)
    const catId = typeof prod.category === 'object' && prod.category !== null 
      ? prod.category._id || prod.category.id 
      : prod.category

    setEditForm({
      name: prod.name || '',
      description: prod.description || '',
      category: catId || '',
      price: prod.price !== undefined ? String(prod.price) : '',
      compareAtPrice: prod.compareAtPrice ? String(prod.compareAtPrice) : '',
      stock: prod.stock !== undefined ? String(prod.stock) : '',
      sku: prod.sku || '',
      fabric: prod.fabric || '',
      color: prod.color || '',
      isBestseller: Boolean(prod.isBestseller),
    })
    setEditExistingImages(Array.isArray(prod.images) ? [...prod.images] : [])
    setEditNewFiles([])
    setEditNewPreviewUrls([])
  }

  const closeEditModal = () => {
    setEditingProduct(null)
    setEditNewPreviewUrls([])
    setEditNewFiles([])
  }

  const handleEditNewFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setEditNewFiles(prev => [...prev, ...files])
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setEditNewPreviewUrls(prev => [...prev, ...newPreviews])
  }

  const removeEditExistingImage = (index) => {
    setEditExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeEditNewImage = (index) => {
    URL.revokeObjectURL(editNewPreviewUrls[index])
    setEditNewPreviewUrls(prev => prev.filter((_, i) => i !== index))
    setEditNewFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingProduct) return

    const totalImagesCount = editExistingImages.length + editNewFiles.length
    if (totalImagesCount === 0) {
      alert('A product must have at least one image.')
      return
    }

    try {
      setIsEditSubmitting(true)
      let finalUploadedUrls = []
      if (editNewFiles.length > 0) {
        const uploadPromises = editNewFiles.map(file => uploadFileToS3(file))
        finalUploadedUrls = await Promise.all(uploadPromises)
      }

      const allImages = [...editExistingImages, ...finalUploadedUrls]

      const payload = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        category: editForm.category,
        price: Number(editForm.price),
        compareAtPrice: editForm.compareAtPrice ? Number(editForm.compareAtPrice) : undefined,
        stock: Number(editForm.stock),
        sku: editForm.sku.trim().toUpperCase(),
        fabric: editForm.fabric.trim(),
        color: editForm.color.trim(),
        isBestseller: Boolean(editForm.isBestseller),
        images: allImages
      }

      await apiClient.patch(`/sarees/${editingProduct._id || editingProduct.id}`, payload)
      closeEditModal()
      fetchData()
      showToast(`Product "${editForm.name}" updated successfully!`)
    } catch (err) {
      console.error('Failed to update product:', err)
      const msg = err.data?.message || err.message || 'Failed to update product'
      setEditError(msg)
      alert(msg)
    } finally {
      setIsEditSubmitting(false)
    }
  }

  // --- BESTSELLER TOGGLE ---
  const toggleBestseller = async (prod) => {
    const prodId = prod._id || prod.id
    const nextVal = !prod.isBestseller
    setProducts(list => list.map(p => ((p._id || p.id) === prodId ? { ...p, isBestseller: nextVal } : p)))
    try {
      await apiClient.patch(`/sarees/${prodId}`, { isBestseller: nextVal })
      showToast(`Bestseller status updated for ${prod.name}`)
    } catch (err) {
      setProducts(list => list.map(p => ((p._id || p.id) === prodId ? { ...p, isBestseller: !nextVal } : p)))
      alert(err.message)
    }
  }

  // --- DELETE PRODUCT ---
  const handleDelete = async (prod) => {
    const prodId = prod._id || prod.id
    if (!window.confirm(`Are you sure you want to permanently delete "${prod.name}"?`)) return
    try {
      await apiClient.delete(`/sarees/${prodId}`)
      fetchData()
      showToast(`Product "${prod.name}" was deleted.`)
    } catch (err) {
      alert(err.message || 'Failed to delete product')
    }
  }

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Text search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchesName = p.name?.toLowerCase().includes(q)
        const matchesSku = p.sku?.toLowerCase().includes(q)
        const matchesFabric = p.fabric?.toLowerCase().includes(q)
        const matchesColor = p.color?.toLowerCase().includes(q)
        if (!matchesName && !matchesSku && !matchesFabric && !matchesColor) return false
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        const catId = typeof p.category === 'object' && p.category !== null 
          ? p.category._id || p.category.id 
          : p.category
        if (catId !== selectedCategory) return false
      }

      // Stock filter
      if (stockFilter === 'LOW' && (p.stock > 5 || p.stock === 0)) return false
      if (stockFilter === 'OUT' && p.stock > 0) return false

      return true
    })
  }, [products, searchQuery, selectedCategory, stockFilter])

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Toast notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-bounce">
          <Check size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* HEADER BAR & CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Products Catalog ({filteredProducts.length})
          </h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Live inventory list with edit, stock tracking, and pricing controls
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.35)] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Add New Saree</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button 
            onClick={fetchData}
            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 font-semibold transition-colors text-white text-xs cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* SEARCH AND FILTERS BAR */}
      <div className={`p-4 rounded-2xl border transition-colors flex flex-wrap items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, fabric, or color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition-colors ${
              isDarkMode 
                ? 'bg-[#080C14] border-[#1C273E] text-white placeholder-slate-500 focus:border-purple-500/60' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
            }`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`text-xs font-medium px-3 py-2 pr-7 rounded-xl border outline-none cursor-pointer appearance-none transition-colors ${
                isDarkMode 
                  ? 'bg-[#080C14] border-[#1C273E] text-slate-200' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>

          {/* Stock Filter Pills */}
          <div className={`flex items-center p-0.5 rounded-xl border ${
            isDarkMode ? 'bg-[#080C14] border-[#1C273E]' : 'bg-slate-50 border-slate-200'
          }`}>
            <button
              onClick={() => setStockFilter('ALL')}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                stockFilter === 'ALL'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Stock
            </button>
            <button
              onClick={() => setStockFilter('LOW')}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                stockFilter === 'LOW'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Low (≤5)
            </button>
            <button
              onClick={() => setStockFilter('OUT')}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                stockFilter === 'OUT'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE (Atlas PRO style) */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${
                isDarkMode 
                  ? 'bg-[#0B0F19]/80 border-[#1C273E] text-slate-400' 
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">SKU</th>
                <th className="py-3.5 px-4 font-semibold">Fabric & Color</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold text-center">Bestseller</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#1C273E]' : 'divide-slate-100'}`}>
              {filteredProducts.map((prod) => {
                const prodId = prod._id || prod.id
                const isLow = prod.stock > 0 && prod.stock <= 5
                const isOut = prod.stock === 0

                return (
                  <tr 
                    key={prodId} 
                    className={`transition-colors group ${
                      isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Thumbnail + Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60 relative">
                          {prod.images?.[0] ? (
                            <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <Package size={16} />
                            </div>
                          )}
                          {prod.images?.length > 1 && (
                            <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-[9px] font-bold text-white px-1 rounded">
                              +{prod.images.length - 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold text-xs line-clamp-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {prod.name}
                          </p>
                          <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {typeof prod.category === 'object' && prod.category !== null ? prod.category.name : 'Saree'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-4">
                      <span className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
                        isDarkMode 
                          ? 'bg-[#080C14] border-[#1C273E] text-purple-300' 
                          : 'bg-slate-100 border-slate-200 text-purple-700'
                      }`}>
                        {prod.sku}
                      </span>
                    </td>

                    {/* Fabric & Color */}
                    <td className="py-3.5 px-4">
                      <span className={`text-[11px] block font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {prod.fabric || '—'}
                      </span>
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {prod.color || '—'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          ₹{prod.price?.toLocaleString('en-IN')}
                        </span>
                        {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                          <span className="line-through text-[10px] text-slate-400">
                            ₹{prod.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        isOut
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : isLow
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isOut ? 'Out of stock' : `${prod.stock} in stock`}
                      </span>
                    </td>

                    {/* Bestseller Toggle Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(prod.isBestseller)}
                        onClick={() => toggleBestseller(prod)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          prod.isBestseller 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_10px_rgba(124,58,237,0.4)]' 
                            : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            prod.isBestseller ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* EDIT BUTTON (Feature requested by user) */}
                        <button
                          onClick={() => openEditModal(prod)}
                          className={`p-1.5 rounded-lg border transition-all text-purple-400 hover:text-white ${
                            isDarkMode 
                              ? 'bg-purple-950/30 border-purple-500/30 hover:bg-purple-600' 
                              : 'bg-purple-50 border-purple-200 hover:bg-purple-600 text-purple-700'
                          }`}
                          title="Edit product details & specifications"
                        >
                          <Edit3 size={14} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(prod)}
                          className={`p-1.5 rounded-lg border transition-all text-rose-400 hover:text-white ${
                            isDarkMode 
                              ? 'bg-rose-950/30 border-rose-500/30 hover:bg-rose-600' 
                              : 'bg-rose-50 border-rose-200 hover:bg-rose-600 text-rose-700'
                          }`}
                          title="Delete saree from catalog"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="7" className={`py-12 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    No products matched the current search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDIT PRODUCT MODAL (High-Priority User Feature) */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className={`w-full max-w-2xl my-8 rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
            isDarkMode ? 'bg-[#0B0F19] border-[#1C273E]' : 'bg-white border-slate-200'
          }`}>
            {/* Modal Header */}
            <div className={`p-6 border-b flex items-center justify-between ${
              isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Edit3 size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Edit Saree Details
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    SKU: {editingProduct.sku} · ID: {(editingProduct._id || editingProduct.id).slice(-8)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeEditModal}
                className={`p-2 rounded-xl transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Product Name */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="e.g. Royal Kanjeevaram Pure Silk Saree"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Elaborate on weave, zari work, pallu, fabric quality..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              {/* Grid 2 Cols: Category, SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Category *
                  </label>
                  <select
                    required
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.sku}
                    onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>

              {/* Grid 3 Cols: Price, Compare Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Compare at Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.compareAtPrice}
                    onChange={(e) => setEditForm({ ...editForm, compareAtPrice: e.target.value })}
                    placeholder="MRP / Original"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>

              {/* Grid 2 Cols: Fabric, Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Fabric Material *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fabric}
                    onChange={(e) => setEditForm({ ...editForm, fabric: e.target.value })}
                    placeholder="e.g. Pure Silk, Organza, Linen"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Primary Color *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.color}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    placeholder="e.g. Crimson Red, Peacock Blue"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>

              {/* Bestseller Checkbox */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isDarkMode ? 'bg-[#080C14] border-[#1C273E]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Featured in Bestsellers
                  </p>
                  <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Prominently display this saree on the customer storefront homepage
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editForm.isBestseller}
                  onChange={(e) => setEditForm({ ...editForm, isBestseller: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* PRODUCT IMAGES SECTION */}
              <div className="space-y-3">
                <label className={`block text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Product Media (Total: {editExistingImages.length + editNewFiles.length})
                </label>

                {/* Existing Images preview */}
                {editExistingImages.length > 0 && (
                  <div>
                    <p className={`text-[11px] font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Active Images:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {editExistingImages.map((url, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700/60 group">
                          <img src={url} alt={`Existing ${i}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeEditExistingImage(i)}
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Files */}
                <div>
                  <p className={`text-[11px] font-medium mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Upload Additional Images:
                  </p>
                  <div className={`border-2 border-dashed rounded-2xl p-4 text-center relative cursor-pointer transition-colors ${
                    isDarkMode 
                      ? 'border-[#1C273E] hover:border-purple-500/50 hover:bg-slate-800/20' 
                      : 'border-slate-300 hover:border-purple-500 hover:bg-slate-50'
                  }`}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleEditNewFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud size={24} className="mx-auto text-purple-400 mb-1" />
                    <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Click or drag images to append
                    </p>
                    <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      PNG, JPG, WEBP up to 5MB each
                    </p>
                  </div>
                </div>

                {/* New images preview */}
                {editNewPreviewUrls.length > 0 && (
                  <div>
                    <p className={`text-[11px] font-medium mb-2 text-purple-400`}>
                      New Images To Upload:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {editNewPreviewUrls.map((url, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-purple-500/50 group">
                          <img src={url} alt={`New preview ${i}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeEditNewImage(i)}
                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs shadow-md"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t flex items-center justify-end gap-3 border-slate-800/50">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isEditSubmitting}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.35)] disabled:opacity-50"
                >
                  {isEditSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD PRODUCT MODAL */}
      {/* ========================================================================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className={`w-full max-w-2xl my-8 rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
            isDarkMode ? 'bg-[#0B0F19] border-[#1C273E]' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-6 border-b flex items-center justify-between ${
              isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Add New Saree to Catalog
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Fill product specifications, pricing, inventory count, and media
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className={`p-2 rounded-xl transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {addError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Banarasi Georgette Zari Weave Saree"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  placeholder="Detailed saree description, motif patterns, weave heritage..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Category *
                  </label>
                  <select
                    required
                    value={addForm.category}
                    onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.sku}
                    onChange={(e) => setAddForm({ ...addForm, sku: e.target.value })}
                    placeholder="e.g. BNR-GEO-001"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={addForm.compareAtPrice}
                    onChange={(e) => setAddForm({ ...addForm, compareAtPrice: e.target.value })}
                    placeholder="Original MRP"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={addForm.stock}
                    onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Fabric *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.fabric}
                    onChange={(e) => setAddForm({ ...addForm, fabric: e.target.value })}
                    placeholder="e.g. Tussar Silk, Chanderi"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Color *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.color}
                    onChange={(e) => setAddForm({ ...addForm, color: e.target.value })}
                    placeholder="e.g. Maroon & Gold"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isDarkMode ? 'bg-[#080C14] border-[#1C273E]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <p className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Show in Bestsellers
                  </p>
                  <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Highlight on storefront homepage bestsellers section
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={addForm.isBestseller}
                  onChange={(e) => setAddForm({ ...addForm, isBestseller: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Upload Images */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`block text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Product Images * ({addSelectedFiles.length + addCustomUrls.length})
                  </label>
                  <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Upload file or paste image URL
                  </span>
                </div>

                <div className={`border-2 border-dashed rounded-2xl p-5 text-center relative cursor-pointer transition-colors ${
                  isDarkMode 
                    ? 'border-[#1C273E] hover:border-purple-500/50 hover:bg-slate-800/20' 
                    : 'border-slate-300 hover:border-purple-500 hover:bg-slate-50'
                }`}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAddFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud size={24} className="mx-auto text-purple-400 mb-1.5" />
                  <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Click or drag high-res saree images
                  </p>
                  <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Supports PNG, JPG, WEBP
                  </p>
                </div>

                {/* Direct Image URL input */}
                <div className="mt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Or paste image URL (e.g. /product-images/... or https://...)"
                      value={addCustomUrl}
                      onChange={(e) => setAddCustomUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (addCustomUrl.trim()) {
                            setAddCustomUrls(prev => [...prev, addCustomUrl.trim()])
                            setAddCustomUrl('')
                            setAddError(null)
                          }
                        }
                      }}
                      className={`flex-1 px-3.5 py-2 rounded-xl border text-xs outline-none transition-colors ${
                        isDarkMode 
                          ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (addCustomUrl.trim()) {
                          setAddCustomUrls(prev => [...prev, addCustomUrl.trim()])
                          setAddCustomUrl('')
                          setAddError(null)
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer shrink-0"
                    >
                      + Add URL
                    </button>
                  </div>

                  {addCustomUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {addCustomUrls.map((url, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200">
                          <span className="truncate max-w-[220px]">{url}</span>
                          <button
                            type="button"
                            onClick={() => setAddCustomUrls(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-purple-400 hover:text-white cursor-pointer ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {addPreviewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {addPreviewUrls.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-purple-500/40 group">
                        <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeAddImage(i)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs shadow-md cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3 border-slate-800/50">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  disabled={isAddSubmitting}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.35)] disabled:opacity-50"
                >
                  {isAddSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Uploading & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      <span>Save Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
