import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Later we should check if user is actually ADMIN, for now we just show the UI
  // assuming they have logged in as admin. 
  
  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Coupons', path: '/admin/coupons' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-display text-brown">Ambika Admin</h1>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`block px-6 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brown text-white'
                          : 'text-gray-600 hover:bg-brown-light/10 hover:text-brown'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <Link to="/" className="text-sm font-medium text-brown-light hover:text-brown transition-colors">
              &larr; Back to Store
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <h2 className="text-lg font-medium text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
          </h2>
        </div>
        
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
