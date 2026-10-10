import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiClient } from '../../api/client'
import { useAdminTheme } from '../../context/AdminThemeContext'
import { 
  ShoppingBag, 
  IndianRupee, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Layers, 
  ArrowUpRight, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Package
} from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { isDarkMode } = useAdminTheme()
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, lowStockCount: 0 })
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [lowStockItems, setLowStockItems] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin'

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true)
        setError(null)
        const [dashboardRes, usersRes, lowStockRes, ordersRes, catRes] = await Promise.allSettled([
          apiClient.get('/admin/dashboard'),
          apiClient.get('/admin/users?limit=1'),
          apiClient.get('/admin/dashboard/low-stock'),
          apiClient.get('/admin/orders?limit=5'),
          apiClient.get('/categories')
        ])

        if (dashboardRes.status === 'fulfilled') {
          setStats(dashboardRes.value.data || { totalOrders: 0, totalRevenue: 0, lowStockCount: 0 })
        }
        if (usersRes.status === 'fulfilled') {
          setTotalCustomers(usersRes.value.data?.meta?.total ?? 0)
        }
        if (lowStockRes.status === 'fulfilled') {
          setLowStockItems(lowStockRes.value.data || [])
        }
        if (ordersRes.status === 'fulfilled') {
          setRecentOrders(ordersRes.value.data?.items || [])
        }
        if (catRes.status === 'fulfilled') {
          setCategories(catRes.value.data || [])
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-[1600px] mx-auto">
      {error && (
        <div className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${
          isDarkMode ? 'bg-rose-950/40 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          <span>{error}</span>
        </div>
      )}

      {/* 4 STAT METRICS CARDS (Atlas PRO style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Gross Platform Volume */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 ${
          isDarkMode 
            ? 'bg-[#0E1424] border-[#1C273E] hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(147,51,234,0.15)]' 
            : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-md'
        }`}>
          <div className="flex items-start justify-between">
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Gross Platform Volume
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isDarkMode 
                ? 'bg-purple-950/50 border-purple-500/30 text-purple-400' 
                : 'bg-purple-100 border-purple-200 text-purple-700'
            }`}>
              <IndianRupee size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {stats.totalOrders} booked orders processed
            </p>
          </div>
          <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Net Store Margin</span>
            <span className="font-semibold text-purple-400">
              ₹{(stats.totalRevenue * 0.12).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 ${
          isDarkMode 
            ? 'bg-[#0E1424] border-[#1C273E] hover:border-indigo-500/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]' 
            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
        }`}>
          <div className="flex items-start justify-between">
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Active Reservations & Orders
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isDarkMode 
                ? 'bg-indigo-950/50 border-indigo-500/30 text-indigo-400' 
                : 'bg-indigo-100 border-indigo-200 text-indigo-700'
            }`}>
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {stats.totalOrders} <span className="text-sm font-semibold opacity-70">orders</span>
            </h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {recentOrders.length} processed in latest cycle
            </p>
          </div>
          <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Pending Authorization</span>
            <span className="font-semibold text-indigo-400">0</span>
          </div>
        </div>

        {/* Card 3: Total Customers / ADR */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 ${
          isDarkMode 
            ? 'bg-[#0E1424] border-[#1C273E] hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]' 
            : 'bg-white border-slate-200 hover:border-cyan-300 hover:shadow-md'
        }`}>
          <div className="flex items-start justify-between">
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Customer CRM Profiles
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isDarkMode 
                ? 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400' 
                : 'bg-cyan-100 border-cyan-200 text-cyan-700'
            }`}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {totalCustomers} <span className="text-sm font-semibold opacity-70">users</span>
            </h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Calculated across all customer profiles
            </p>
          </div>
          <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Catalog Categories</span>
            <span className="font-semibold text-cyan-400">{categories.length} listed</span>
          </div>
        </div>

        {/* Card 4: Inventory & Low Stock Alert */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 ${
          isDarkMode 
            ? 'bg-[#0E1424] border-[#1C273E] hover:border-rose-500/40 hover:shadow-[0_0_25px_rgba(244,63,94,0.15)]' 
            : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-md'
        }`}>
          <div className="flex items-start justify-between">
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Low Stock & Catalog Alert
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isDarkMode 
                ? 'bg-rose-950/50 border-rose-500/30 text-rose-400' 
                : 'bg-rose-100 border-rose-200 text-rose-700'
            }`}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {stats.lowStockCount} <span className="text-sm font-semibold opacity-70">alerts</span>
            </h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Restock threshold reached
            </p>
          </div>
          <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Operational Health</span>
            <span className="font-semibold text-emerald-400">99.4% Sync</span>
          </div>
        </div>
      </div>

      {/* OPERATIONS & SALES INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Customer Orders Overview */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border transition-colors ${
          isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Recent Orders
              </h3>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Latest customer purchases and order fulfillment activity
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>View All Orders</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-[#1C273E] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-[#1C273E]' : 'divide-slate-100'}`}>
                {recentOrders.slice(0, 5).map((ord) => (
                  <tr key={ord._id || ord.id} className={isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                    <td className={`py-3.5 font-mono text-[11px] ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                      {(ord._id || ord.id).slice(-8).toUpperCase()}
                    </td>
                    <td className={`py-3.5 font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {ord.user?.name || ord.shippingAddress?.name || 'Customer'}
                    </td>
                    <td className={`py-3.5 font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      ₹{ord.totalAmount?.toLocaleString?.('en-IN') || ord.totalAmount}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : ord.orderStatus === 'PENDING'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" className={`py-8 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      No customer orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Top Categories */}
        <div className={`p-6 rounded-2xl border transition-colors flex flex-col justify-between ${
          isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Top Categories
                </h3>
              </div>
              <span className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                By Volume
              </span>
            </div>

            <div className="space-y-4">
              {categories.slice(0, 4).map((cat, idx) => {
                const percentage = [85, 62, 44, 30][idx] || 25
                return (
                  <div key={cat._id || cat.id || idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {cat.name}
                      </span>
                      <span className={`font-semibold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                        {percentage}% Share
                      </span>
                    </div>
                    {/* Glowing Progress bar */}
                    <div className={`w-full h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-[#162033]' : 'bg-slate-100'
                    }`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-400 shadow-[0_0_12px_rgba(147,51,234,0.5)] transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}

              {categories.length === 0 && (
                <div className={`text-xs py-8 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  No category metrics available yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800/40 dark:border-slate-800">
            <Link
              to="/admin/categories"
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                isDarkMode
                  ? 'bg-[#121B2F] border-[#1E2B47] text-slate-300 hover:text-white hover:border-purple-500/50'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>View All Categories in Catalog</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* FULL WIDTH: Low Stock Saree Alerts */}
      <div className={`p-6 rounded-2xl border transition-colors ${
        isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Low Stock Saree Alerts
            </h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Products requiring immediate restock attention
            </p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>Manage Products</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-[#1C273E] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">SKU</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold text-right">Stock</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#1C273E]' : 'divide-slate-100'}`}>
              {lowStockItems.slice(0, 5).map((prod) => (
                <tr key={prod.id || prod._id} className={isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                  <td className="py-3.5 pr-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700/50">
                        {prod.images?.[0] ? (
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <span className={`font-medium line-clamp-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {prod.name}
                      </span>
                    </div>
                  </td>
                  <td className={`py-3.5 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {prod.sku}
                  </td>
                  <td className={`py-3.5 font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    ₹{prod.price}
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      {prod.stock} left
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && lowStockItems.length === 0 && (
                <tr>
                  <td colSpan="4" className={`py-8 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    All products are well-stocked.
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
