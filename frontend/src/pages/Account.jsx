import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Placeholder from '../components/ui/Placeholder'
import Button from '../components/ui/Button'
import { toneFor } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiClient } from '../api/client'
import Seo from '../components/seo/Seo'

const tabs = ['Profile', 'My Orders', 'Addresses', 'Wishlist']

export default function Account() {
  const [active, setActive] = useState(tabs[0])
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const { items } = useCart()
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (user) {
      setLoadingOrders(true)
      apiClient.get('/orders')
        .then(res => setOrders(res.data.items || []))
        .catch(err => console.error('Failed to load orders', err))
        .finally(() => setLoadingOrders(false))
    }
  }, [user])

  if (loading) return <div className="py-20 text-center">Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  // Generate initials
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <section className="container-ambika py-10">
      <Seo title="My Account" description="Manage your Vinit Textiles profile, orders, addresses and wishlist." noindex />
      <h1 className="font-display text-4xl text-maroon">My Account</h1>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="flex items-center gap-3 border-b border-cream-dark pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brown text-sm font-semibold text-ivory">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-maroon">{user.name}</p>
              <p className="text-xs text-stone">{user.email}</p>
            </div>
          </div>
          <nav className="mt-5 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActive(tab)}
                className={`shrink-0 px-4 py-2 text-left text-sm font-medium lg:px-3 ${
                  active === tab ? 'bg-brown text-ivory' : 'text-brown/80 hover:bg-cream-dark/60'
                }`}
              >
                {tab}
              </button>
            ))}
            <button
              type="button"
              onClick={logout}
              className="shrink-0 px-4 py-2 text-left text-sm font-medium text-stone hover:text-maroon lg:px-3"
            >
              Log Out
            </button>
          </nav>
        </aside>

        <div className="flex-1 border border-cream-dark bg-ivory p-6 sm:p-8">
          {active === 'Profile' && (
            <div>
              <h2 className="font-display text-2xl text-maroon">Profile Details</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brown">Full Name</span>
                  <input
                    defaultValue={user.name}
                    className="mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon focus:border-brown focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brown">Email</span>
                  <input
                    defaultValue={user.email}
                    disabled
                    className="mt-2 w-full border border-brown/30 bg-transparent/50 px-4 py-3 text-sm text-maroon opacity-70 cursor-not-allowed"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brown">Phone</span>
                  <input
                    defaultValue={user.phone || ''}
                    className="mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon focus:border-brown focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brown">Member Since</span>
                  <input
                    defaultValue={new Date(user.createdAt).toLocaleDateString()}
                    disabled
                    className="mt-2 w-full border border-brown/30 bg-transparent/50 px-4 py-3 text-sm text-maroon opacity-70 cursor-not-allowed"
                  />
                </label>
              </div>
              <Button variant="primary" className="mt-6">
                Save Changes
              </Button>
            </div>
          )}

          {active === 'My Orders' && (
            <div>
              <h2 className="font-display text-2xl text-maroon">My Orders</h2>
              {loadingOrders ? (
                <p className="mt-4 text-sm text-stone">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="mt-4 text-sm text-stone">You have no orders yet.</p>
              ) : (
                <div className="mt-6 divide-y divide-cream-dark border-y border-cream-dark">
                  {orders.map((order) => (
                    <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm">
                      <span className="font-medium text-maroon font-mono">#{order.id.slice(-6).toUpperCase()}</span>
                      <span className="text-stone">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="text-brown font-medium">{order.orderStatus}</span>
                      <span className="font-semibold text-brown">₹{order.totalAmount?.toLocaleString('en-IN') || 0}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {active === 'Addresses' && (
            <div>
              <h2 className="font-display text-2xl text-maroon">Saved Addresses</h2>
              <div className="mt-6 border border-cream-dark p-5 text-sm">
                <p className="font-semibold text-maroon">Home</p>
                <p className="mt-1 text-brown/80">
                  123 Heritage Lane, Navrangpura, Ahmedabad, Gujarat 380009
                </p>
                <p className="mt-1 text-brown/80">+91 98765 43210</p>
              </div>
              <Button variant="outline" className="mt-5">
                Add New Address
              </Button>
            </div>
          )}

          {active === 'Wishlist' && (
            <div>
              <h2 className="font-display text-2xl text-maroon">Wishlist</h2>
              {items.length === 0 ? (
                <p className="mt-4 text-sm text-stone">
                  You haven&apos;t saved anything yet.{' '}
                  <Link to="/shop/saree" className="font-medium text-brown hover:underline">
                    Start browsing
                  </Link>
                  .
                </p>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {items.map((item) => (
                    <Placeholder
                      key={item.key}
                      label={item.product.name}
                      tone={toneFor(item.product.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
