import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    sku: '',
    fabric: '',
    color: '',
    images: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        images: formData.images.split(',').map(url => url.trim()).filter(Boolean)
      }
      await apiClient.post('/sarees', payload)
      setIsFormOpen(false)
      setFormData({ name: '', description: '', category: '', price: 0, sku: '', fabric: '', color: '', images: '' })
      fetchData()
    } catch (err) {
      alert(err.message)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display text-brown">Products (Sarees)</h2>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-brown text-white px-4 py-2 rounded text-sm hover:bg-brown-light"
        >
          {isFormOpen ? 'Close Form' : 'Add Product'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select required className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" required className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input required className="w-full border p-2 rounded" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fabric</label>
            <input required className="w-full border p-2 rounded" value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input required className="w-full border p-2 rounded" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
            <input required className="w-full border p-2 rounded" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-brown text-white px-4 py-2 rounded text-sm w-full">Save Product</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-600">Image</th>
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">SKU</th>
              <th className="p-4 font-medium text-gray-600">Price</th>
              <th className="p-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(prod => (
              <tr key={prod.id}>
                <td className="p-4">
                  <img src={prod.images[0]} alt={prod.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-4 font-medium">{prod.name}</td>
                <td className="p-4 text-gray-500">{prod.sku}</td>
                <td className="p-4">₹{prod.price}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(prod.id)} className="text-red-500 hover:underline">Delete</button>
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
