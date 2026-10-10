import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Package, 
  Tag, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  RotateCw,
  Search,
  Sparkles,
  ShieldCheck,
  Plus,
  Bell
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminThemeProvider, useAdminTheme } from '../../context/AdminThemeContext'
import { apiClient } from '../../api/client'

export default function AdminLayoutWrapper() {
  return (
    <AdminThemeProvider>
      <AdminLayout />
    </AdminThemeProvider>
  )
}

function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useAdminTheme()
  const [productCount, setProductCount] = useState(null)
  const [orderCount, setOrderCount] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')

  useEffect(() => {
    // Fetch counts for badges
    async function fetchCounts() {
      try {
        const [pRes, oRes] = await Promise.allSettled([
          apiClient.get('/sarees?limit=1'),
          apiClient.get('/admin/orders?limit=1')
        ])
        if (pRes.status === 'fulfilled' && pRes.value.data?.meta) {
          setProductCount(pRes.value.data.meta.total)
        }
        if (oRes.status === 'fulfilled' && oRes.value.data?.meta) {
          setOrderCount(oRes.value.data.meta.total)
        }
      } catch {
        // silent fallback
      }
    }
    if (user && user.role === 'ADMIN') {
      fetchCounts()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080C14] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Vinit Textiles Admin...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />
  }

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag, badge: productCount !== null ? productCount : undefined },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: Package, badge: orderCount !== null ? orderCount : undefined },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      window.location.reload()
    }, 400)
  }

  // Derive page heading based on current route
  const getPageMeta = () => {
    if (location.pathname === '/admin') {
      return {
        title: 'Executive Dashboard',
        subtitle: 'Real-time catalog metrics, gross revenue, and operations activity',
        actionBtn: { label: '+ New Product', action: () => navigate('/admin/products?action=new') }
      }
    }
    if (location.pathname.startsWith('/admin/products')) {
      return {
        title: 'Products Management',
        subtitle: 'Manage inventory, edit saree specifications, pricing & media catalog',
        actionBtn: null
      }
    }
    if (location.pathname.startsWith('/admin/categories')) {
      return {
        title: 'Categories Catalog',
        subtitle: 'Organize sarees by collection, weave style, fabric, and occasions',
        actionBtn: null
      }
    }
    if (location.pathname.startsWith('/admin/orders')) {
      return {
        title: 'Customer Orders',
        subtitle: 'Track fulfillment status, dispatches, payments, and delivery milestones',
        actionBtn: null
      }
    }
    if (location.pathname.startsWith('/admin/coupons')) {
      return {
        title: 'Promotions & Coupons',
        subtitle: 'Manage discount codes, percentage vouchers, and minimum cart thresholds',
        actionBtn: null
      }
    }
    return {
      title: 'Operations & Admin',
      subtitle: 'System management and platform configuration',
      actionBtn: null
    }
  }

  const pageMeta = getPageMeta()

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-200 ${
      isDarkMode 
        ? 'dark bg-[#080C14] text-slate-100 selection:bg-purple-600 selection:text-white' 
        : 'bg-[#F4F6FB] text-slate-900 selection:bg-purple-200 selection:text-purple-900'
    }`}>
      {/* SIDEBAR (Atlas PRO style) */}
      <aside className={`w-64 shrink-0 flex flex-col border-r z-30 transition-colors duration-200 sticky top-0 h-screen ${
        isDarkMode 
          ? 'bg-[#0B0F19] border-[#162033]' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Brand / Logo */}
        <div className="p-5 pb-4 flex items-center justify-between border-b border-transparent">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 p-0.5 shadow-[0_0_15px_rgba(147,51,234,0.45)] flex items-center justify-center text-white">
              <div className="w-full h-full rounded-[10px] bg-[#0B0F19]/20 flex items-center justify-center">
                <Sparkles size={20} className="text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Vinit Textiles
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 tracking-wider">
                  PORTAL
                </span>
              </div>
              <p className={`text-[11px] font-medium leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Operations & Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 scrollbar-hide">
          <div>
            <div className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Management
            </div>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.path 
                  : location.pathname.startsWith(item.path)

                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? isDarkMode
                            ? 'bg-purple-600/15 text-purple-300 border border-purple-500/35 shadow-[0_0_15px_rgba(147,51,234,0.15)] font-semibold'
                            : 'bg-purple-50 text-purple-700 border border-purple-200 shadow-xs font-semibold'
                          : isDarkMode
                            ? 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon 
                          size={18} 
                          className={isActive ? 'text-purple-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'} 
                          strokeWidth={isActive ? 2.3 : 1.8} 
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive
                            ? isDarkMode ? 'bg-purple-500/25 text-purple-200' : 'bg-purple-200 text-purple-800'
                            : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Storefront Section */}
          <div>
            <div className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Storefront Portal
            </div>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isDarkMode
                      ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/20 border border-cyan-500/20'
                      : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink size={17} />
                    <span>Live Storefront</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                    Client
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className={`p-3.5 m-3 rounded-2xl border transition-colors ${
          isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                System Status
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Operational
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Engine
            </span>
            <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
            }`}>
              v2.4 LIVE
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/40 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={logout}
              className={`p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors`}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR (Atlas PRO style) */}
        <header className={`px-8 py-5 border-b z-20 flex flex-wrap items-center justify-between gap-4 sticky top-0 transition-colors backdrop-blur-xl ${
          isDarkMode 
            ? 'bg-[#080C14]/90 border-[#162033]' 
            : 'bg-white/90 border-slate-200'
        }`}>
          {/* Left Title + Live Sync Badge */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {pageMeta.title}
              </h1>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-0.5 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {pageMeta.subtitle}
            </p>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className={`relative hidden md:block rounded-xl border transition-colors ${
              isDarkMode 
                ? 'bg-[#0E1424] border-[#1C273E] focus-within:border-purple-500/60' 
                : 'bg-slate-50 border-slate-200 focus-within:border-purple-500'
            }`}>
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Quick search..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && globalSearch.trim()) {
                    navigate(`/admin/products?search=${encodeURIComponent(globalSearch.trim())}`)
                  }
                }}
                className={`pl-9 pr-4 py-2 text-xs rounded-xl bg-transparent outline-none w-44 lg:w-56 ${
                  isDarkMode ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Reload button */}
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-xl border transition-all ${
                isRefreshing ? 'rotate-180 duration-500' : ''
              } ${
                isDarkMode 
                  ? 'bg-[#0E1424] border-[#1C273E] text-slate-300 hover:text-white hover:border-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
              title="Refresh Dashboard"
            >
              <RotateCw size={17} />
            </button>

            {/* Context Primary Action Button */}
            {pageMeta.actionBtn && (
              <button
                onClick={pageMeta.actionBtn.action}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.35)] flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus size={16} />
                <span>{pageMeta.actionBtn.label}</span>
              </button>
            )}

            {/* Dark / Light Mode Switch */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-[#0E1424] border-[#1C273E] text-amber-400 hover:bg-slate-800' 
                  : 'bg-slate-50 border-slate-200 text-indigo-600 hover:bg-slate-100'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Live Storefront App Pill */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition-colors ${
                isDarkMode 
                  ? 'bg-[#0E1424] border-[#1C273E] text-slate-300 hover:text-white hover:border-slate-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Storefront</span>
              <ExternalLink size={13} className="text-slate-400" />
            </Link>

            {/* Admin Console Pill */}
            <div className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border ${
              isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="text-left hidden lg:block">
                <p className={`text-xs font-semibold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Admin Console
                </p>
                <p className="text-[10px] text-purple-400 font-medium leading-none">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
