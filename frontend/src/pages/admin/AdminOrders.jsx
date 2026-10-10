import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'
import { useAdminTheme } from '../../context/AdminThemeContext'
import { Package, Search, Calendar, Check, ChevronDown, Clock, ShieldCheck } from 'lucide-react'

export default function AdminOrders() {
  const { isDarkMode } = useAdminTheme()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [toast, setToast] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/admin/orders?limit=100')
      setOrders(res.data.items || [])
    } catch (err) {
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { orderStatus: newStatus })
      fetchOrders()
      showToast(`Order status updated to ${newStatus}`)
    } catch (err) {
      alert(err.message || 'Failed to update order status')
    }
  }

  const statusThemes = {
    PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    CONFIRMED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    PROCESSING: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    SHIPPED: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    DELIVERED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    CANCELLED: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
  }

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim()
    if (q) {
      const idMatch = (o._id || o.id)?.toLowerCase().includes(q)
      const nameMatch = o.user?.name?.toLowerCase().includes(q)
      const emailMatch = o.user?.email?.toLowerCase().includes(q)
      if (!idMatch && !nameMatch && !emailMatch) return false
    }
    if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false
    return true
  })

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-bounce">
          <Check size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Customer Orders Fulfillment ({filteredOrders.length})
          </h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage dispatch statuses, payment confirmation, and delivery updates
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border transition-colors flex flex-wrap items-center justify-between gap-4 ${
        isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Order ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition-colors ${
              isDarkMode 
                ? 'bg-[#080C14] border-[#1C273E] text-white placeholder-slate-500 focus:border-purple-500/60' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
            }`}
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                  : isDarkMode 
                    ? 'bg-[#080C14] border-[#1C273E] text-slate-400 hover:text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${
                isDarkMode ? 'bg-[#0B0F19]/80 border-[#1C273E] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <th className="py-3.5 px-4 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                <th className="py-3.5 px-4 font-semibold">Order Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#1C273E]' : 'divide-slate-100'}`}>
              {filteredOrders.map((order) => {
                const orderId = order._id || order.id
                const themeClass = statusThemes[order.orderStatus] || 'bg-slate-700/30 text-slate-300 border-slate-600'

                return (
                  <tr key={orderId} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      <span className={`px-2 py-0.5 rounded border ${
                        isDarkMode ? 'bg-[#080C14] border-[#1C273E] text-purple-300' : 'bg-slate-100 border-slate-200 text-purple-700'
                      }`}>
                        #{orderId.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {order.user?.name || 'Guest Checkout'}
                      </p>
                      <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {order.user?.email || '—'}
                      </p>
                    </td>
                    <td className={`py-3.5 px-4 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {order.items?.length || 1} saree(s)
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className={`py-3.5 px-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(orderId, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer tracking-wider uppercase transition-colors ${themeClass}`}
                      >
                        <option value="PENDING" className="bg-[#0B0F19] text-amber-400">PENDING</option>
                        <option value="CONFIRMED" className="bg-[#0B0F19] text-blue-400">CONFIRMED</option>
                        <option value="PROCESSING" className="bg-[#0B0F19] text-purple-400">PROCESSING</option>
                        <option value="SHIPPED" className="bg-[#0B0F19] text-cyan-400">SHIPPED</option>
                        <option value="DELIVERED" className="bg-[#0B0F19] text-emerald-400">DELIVERED</option>
                        <option value="CANCELLED" className="bg-[#0B0F19] text-rose-400">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                )
              })}

              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className={`py-12 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    No orders matched the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
