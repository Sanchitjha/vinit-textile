import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true })

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/categories')
      setCategories(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/categories', formData)
      setIsFormOpen(false)
      setFormData({ name: '', description: '', isActive: true })
      fetchCategories()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await apiClient.delete(`/categories/${id}`)
      fetchCategories()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display text-brown">Categories</h2>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-brown text-white px-4 py-2 rounded text-sm hover:bg-brown-light"
        >
          {isFormOpen ? 'Close Form' : 'Add Category'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              required
              className="w-full border p-2 rounded" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input 
              className="w-full border p-2 rounded" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={formData.isActive}
              onChange={e => setFormData({...formData, isActive: e.target.checked})}
            />
            <label className="text-sm font-medium">Active</label>
          </div>
          <button type="submit" className="bg-brown text-white px-4 py-2 rounded text-sm w-full">
            Save Category
          </button>
        </form>
      )}

      <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">Description</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(cat => (
              <tr key={cat.id}>
                <td className="p-4">{cat.name}</td>
                <td className="p-4">{cat.description}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
