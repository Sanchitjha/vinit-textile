import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'
import { uploadFileToS3 } from '../../utils/s3Upload'
import { X, UploadCloud, Loader2 } from 'lucide-react'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    sku: '',
    fabric: '',
    color: '',
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([
        apiClient.get('/sarees?limit=100'),
        apiClient.get('/categories')
      ])
      setProducts(prodRes.data.items || [])
      setCategories(catRes.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setSelectedFiles(prev => [...prev, ...files])
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setPreviewUrls(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index])
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedFiles.length === 0) {
      alert('Please select at least one image')
      return
    }

    try {
      setIsUploading(true)
      
      // Upload all files to S3
      const uploadPromises = selectedFiles.map(file => uploadFileToS3(file))
      const uploadedUrls = await Promise.all(uploadPromises)
      
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: uploadedUrls
      }
      
      await apiClient.post('/sarees', payload)
      setIsFormOpen(false)
      setFormData({ name: '', description: '', category: '', price: 0, stock: 0, sku: '', fabric: '', color: '' })
      setSelectedFiles([])
      setPreviewUrls([])
      fetchData()
    } catch (err) {
      alert(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await apiClient.delete(`/sarees/${id}`)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="p-8 w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display text-brown dark:text-white">Products (Sarees)</h2>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-brown text-white px-4 py-2 rounded text-sm hover:bg-brown-light"
        >
          {isFormOpen ? 'Close Form' : 'Add Product'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required className="w-full glass-input p-2.5 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full glass-input p-2.5 rounded-xl" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select required className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input type="number" required className="w-full glass-input p-2.5 rounded-xl" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input required className="w-full glass-input p-2.5 rounded-xl" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" required className="w-full glass-input p-2.5 rounded-xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fabric</label>
            <input required className="w-full glass-input p-2.5 rounded-xl" value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input required className="w-full glass-input p-2.5 rounded-xl" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
          </div>
          <div className="col-span-2 mt-2">
            <label className="block text-sm font-medium mb-2">Product Images</label>
            <div className="glass-panel border-dashed border-2 p-8 rounded-2xl text-center cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 transition-colors relative">
              <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-500 mt-1">High resolution images are recommended</p>
            </div>
            
            {previewUrls.length > 0 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative shrink-0 w-28 h-28 rounded-xl overflow-hidden glass-card group">
                    <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(i)} 
                      className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md backdrop-blur-sm"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="col-span-2 mt-4">
            <button type="submit" disabled={isUploading} className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-3.5 rounded-xl text-sm w-full font-medium hover:bg-black dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
              {isUploading && <Loader2 size={18} className="animate-spin" />}
              {isUploading ? 'Uploading Images & Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      )}

      <div className="glass-panel rounded-3xl overflow-hidden">
        <table className="w-full text-left text-sm dark:text-gray-300">
          <thead className="bg-white/30 dark:bg-black/20 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30">
            <tr>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Image</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Name</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">SKU</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Price</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
            {products.map(prod => (
              <tr key={prod._id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-4 font-medium">{prod.name}</td>
                <td className="p-4 text-gray-500">{prod.sku}</td>
                <td className="p-4">₹{prod.price}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(prod._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
