import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Home, 
  ShoppingBag, 
  Layers, 
  Package, 
  Tag, 
  Settings, 
  HelpCircle, 
  Users, 
  LogOut,
  Hexagon,
  Sun,
  Moon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminThemeProvider, useAdminTheme } from '../../context/AdminThemeContext'

export default function AdminLayoutWrapper() {
  return (
    <AdminThemeProvider>
      <AdminLayout />
    </AdminThemeProvider>
  )
}

function AdminLayout() {
  const location = useLocation()
  const { user, loading, logout } = useAuth()
  const { isDarkMode, toggleDarkMode } = useAdminTheme()

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />
  }

  const navItems = [
    { name: 'Home', path: '/admin', icon: Home },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: Package },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  ]

  const toolItems = [
    { name: 'Settings', path: '#', icon: Settings },
    { name: 'Help', path: '#', icon: HelpCircle },
    { name: 'Manage user', path: '#', icon: Users },
  ]

  return (
    <div className={`flex min-h-screen font-sans ${isDarkMode ? 'dark bg-animated-gradient-dark text-gray-200' : 'bg-animated-gradient-light text-gray-800'}`}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col pt-8 pb-6 px-4 shrink-0 z-20 glass-panel border-r-white/20 dark:border-r-white/5 border-y-0 border-l-0">
        <div className="flex items-center justify-between px-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white dark:bg-white dark:text-black p-1.5 rounded-lg">
              <Hexagon size={24} className="fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight">Ambika</span>
          </div>
          <button onClick={toggleDarkMode} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        
        <nav className="flex-1 space-y-8">
          <div>
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-[15px] font-medium transition-all duration-300 ${
                        isActive
                          ? 'glass-card text-gray-900 dark:text-white shadow-md'
                          : 'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white glass-panel-hover'
                      }`}
                    >
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
          
          <div>
            <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tools
            </div>
            <ul className="space-y-1">
              {toolItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-4 px-4 py-2.5 rounded-xl text-[14px] font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white glass-panel-hover transition-all duration-300"
                  >
                    <item.icon size={18} strokeWidth={2} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        <div className="mt-auto pt-8 border-t border-white/20 dark:border-white/5">
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-4 py-2 w-full text-left text-[14px] font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white glass-panel-hover rounded-xl transition-all duration-300"
          >
            <LogOut size={18} strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative bg-transparent z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
