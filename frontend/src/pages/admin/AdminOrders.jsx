import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/admin/orders?limit=50')
      setOrders(res.data.items || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { orderStatus: newStatus })
      fetchOrders()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }

  return (
    <div className="p-8 w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display text-brown dark:text-white">Orders</h2>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden">
        <table className="w-full text-left text-sm dark:text-gray-300">
          <thead className="bg-white/30 dark:bg-black/20 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30">
            <tr>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Order ID</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Customer</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Total</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
              <th className="p-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/30 dark:divide-gray-700/30">
            {orders.map(order => (
              <tr key={order._id || order.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-xs">{order._id || order.id}</td>
                <td className="p-4">{order.user?.name || 'Guest'}</td>
                <td className="p-4">₹{order.totalAmount}</td>
                <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <select 
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                    className={`px-2 py-1 rounded-lg text-xs border backdrop-blur-sm ${statusColors[order.orderStatus] || 'bg-white/50 text-gray-800'} dark:border-gray-700/30 outline-none`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
