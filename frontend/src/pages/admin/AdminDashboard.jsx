import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiClient } from '../../api/client'
import { Search, Bell, ChevronDown, ShoppingBag, IndianRupee, Users, AlertTriangle } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, lowStockCount: 0 })
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [lowStockItems, setLowStockItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Extract first name for greeting
  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin'

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true)
        setError(null)
        const [dashboardRes, usersRes, lowStockRes] = await Promise.all([
          apiClient.get('/admin/dashboard'),
          apiClient.get('/admin/users?limit=1'),
          apiClient.get('/admin/dashboard/low-stock'),
        ])
        setStats(dashboardRes.data)
        setTotalCustomers(usersRes.data?.meta?.total ?? 0)
        setLowStockItems(lowStockRes.data || [])
      } catch (err) {
        // Show the real error rather than fake numbers — an admin dashboard
        // that quietly substitutes made-up revenue/order figures on failure
        // is worse than one that visibly says the data didn't load.
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString('en-IN'), icon: ShoppingBag, color: '#4ade80' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: '#c9972e' },
    { label: 'Total Customers', value: totalCustomers.toLocaleString('en-IN'), icon: Users, color: '#2dd4bf' },
    { label: 'Low Stock Items', value: stats.lowStockCount.toLocaleString('en-IN'), icon: AlertTriangle, color: '#f43f5e' },
  ]

  return (
    <div className="p-8 pb-20 w-full">

      {/* Header section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-[32px] font-medium text-gray-900 dark:text-white tracking-tight leading-tight">
            Welcome Back, {firstName}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-[15px]">
            Here&apos;s what happening with your store today
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-gray-700 transition-colors">
            <Search size={22} strokeWidth={2} />
          </button>
          <button className="text-gray-400 hover:text-gray-700 transition-colors relative">
            <Bell size={22} strokeWidth={2} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="flex items-center gap-3 cursor-pointer pl-2">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${firstName}&background=f3f4f6&color=111827`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div className="hidden sm:block text-sm">
              <p className="font-medium text-gray-900 dark:text-white leading-none">{firstName}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card) => (
          <div key={card.label} className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="relative z-10">
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${card.color}1a`, color: card.color }}
              >
                <card.icon size={20} strokeWidth={2} />
              </div>
              <h3 className="text-[28px] font-medium text-gray-900 dark:text-white leading-none mb-2 tracking-tight">
                {loading ? '—' : card.value}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Low stock products table */}
      <div className="glass-panel rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-1">Low Stock Products</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Products at or below the restock threshold</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium">SKU</th>
                <th className="pb-4 font-medium">Price</th>
                <th className="pb-4 font-medium text-right pr-4">Stock Left</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((product) => (
                <tr key={product.id} className="border-b border-gray-200/30 dark:border-gray-700/30 group hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {product.images?.[0] && (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{product.sku}</td>
                  <td className="py-4 text-sm text-gray-500 dark:text-gray-400">₹{product.price}</td>
                  <td className="py-4 text-right pr-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full text-red-500 bg-red-50">
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && lowStockItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    All products are well stocked.
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
