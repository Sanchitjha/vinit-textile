import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minimumOrderValue: 0,
    expiresAt: '',
    isActive: true
  })

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/coupons')
      setCoupons(res.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minimumOrderValue: Number(formData.minimumOrderValue),
      }
      await apiClient.post('/coupons', payload)
      setIsFormOpen(false)
      setFormData({ code: '', discountType: 'percentage', discountValue: 0, minimumOrderValue: 0, expiresAt: '', isActive: true })
      fetchCoupons()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await apiClient.delete(`/coupons/${id}`)
      fetchCoupons()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display text-brown">Coupons</h2>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-brown text-white px-4 py-2 rounded text-sm hover:bg-brown-light"
        >
          {isFormOpen ? 'Close Form' : 'Add Coupon'}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Code</label>
            <input required className="w-full border p-2 rounded" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount Type</label>
            <select className="w-full border p-2 rounded" value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})}>
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Discount Value</label>
            <input type="number" required className="w-full border p-2 rounded" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min Order Value</label>
            <input type="number" className="w-full border p-2 rounded" value={formData.minimumOrderValue} onChange={e => setFormData({...formData, minimumOrderValue: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expires At</label>
            <input type="date" required className="w-full border p-2 rounded" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
            <label className="text-sm font-medium">Active</label>
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-brown text-white px-4 py-2 rounded text-sm w-full">Save Coupon</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-600">Code</th>
              <th className="p-4 font-medium text-gray-600">Discount</th>
              <th className="p-4 font-medium text-gray-600">Min Order</th>
              <th className="p-4 font-medium text-gray-600">Expires</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map(coupon => (
              <tr key={coupon.id}>
                <td className="p-4 font-medium">{coupon.code}</td>
                <td className="p-4">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                </td>
                <td className="p-4">₹{coupon.minimumOrderValue}</td>
                <td className="p-4 text-gray-500">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No coupons found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
