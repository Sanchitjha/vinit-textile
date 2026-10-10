import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Truck,
  Calendar,
  CreditCard,
  MapPin,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Receipt
} from 'lucide-react'
import { apiClient } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function OrdersList() {
  const { user, openAuthModal } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [cancelModalOrder, setCancelModalOrder] = useState(null)
  const [cancelError, setCancelError] = useState('')

  const fetchOrders = () => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    apiClient
      .get('/orders')
      .then((res) => {
        const list = res?.data?.items || res?.data || res?.items || []
        setOrders(Array.isArray(list) ? list : [])
      })
      .catch((err) => {
        console.error('Failed to load orders', err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [user])

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return
    const orderId = cancelModalOrder._id || cancelModalOrder.id
    setCancellingId(orderId)
    setCancelError('')

    try {
      await apiClient.post(`/orders/${orderId}/cancel`)
      setCancelModalOrder(null)
      fetchOrders()
    } catch (err) {
      setCancelError(err?.message || 'Could not cancel order. Please contact support.')
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase()
    switch (s) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Delivered
          </span>
        )
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-200">
            <Truck size={13} className="text-purple-600" />
            Shipped / In Transit
          </span>
        )
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
            <Package size={13} className="text-blue-600" />
            Confirmed
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
            <AlertCircle size={13} className="text-rose-600" />
            Cancelled
          </span>
        )
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
            <Clock size={13} className="text-amber-600" />
            Processing
          </span>
        )
    }
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-brown/10 bg-white p-8 text-center sm:p-12 shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon/10 text-maroon mb-4">
          <Package size={30} />
        </div>
        <h3 className="font-display text-2xl text-brown">Sign in to view your orders</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-brown-light">
          Track packages, check past purchases, download invoices, and initiate returns with your Vinit Textiles account.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openAuthModal?.('login')}
            className="rounded-full bg-maroon px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-maroon/90 shadow-xs transition-colors"
          >
            Sign In Now
          </button>
          <Link
            to="/track-order"
            className="rounded-full border border-brown/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-brown hover:bg-cream/50 transition-colors"
          >
            Track with Order ID
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-brown/10 bg-white p-6 shadow-xs">
            <div className="flex justify-between items-center border-b border-brown/10 pb-4">
              <div className="h-5 w-32 bg-cream rounded" />
              <div className="h-5 w-24 bg-cream rounded-full" />
            </div>
            <div className="py-4 space-y-3">
              <div className="h-16 w-full bg-cream/70 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'ACTIVE') {
      return ['PENDING', 'CONFIRMED', 'SHIPPED', 'PROCESSING'].includes((order.orderStatus || '').toUpperCase())
    }
    if (activeFilter === 'DELIVERED') {
      return (order.orderStatus || '').toUpperCase() === 'DELIVERED'
    }
    if (activeFilter === 'CANCELLED') {
      return (order.orderStatus || '').toUpperCase() === 'CANCELLED'
    }
    return true
  })

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-brown/10 pb-3">
        {[
          { key: 'ALL', label: `All Orders (${orders.length})` },
          { key: 'ACTIVE', label: 'In Progress' },
          { key: 'DELIVERED', label: 'Delivered' },
          { key: 'CANCELLED', label: 'Cancelled' },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === f.key
                ? 'bg-maroon text-ivory shadow-xs'
                : 'bg-cream/60 text-brown hover:bg-cream hover:text-maroon'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-brown/10 bg-white p-8 text-center sm:p-14 shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream text-maroon mb-4">
            <ShoppingBag size={28} />
          </div>
          <h3 className="font-display text-2xl text-brown">
            {activeFilter === 'ALL' ? 'No orders placed yet' : `No ${activeFilter.toLowerCase()} orders`}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-brown-light">
            {activeFilter === 'ALL'
              ? 'Explore our exquisite festive and bridal saree collection and make your celebrations unforgettable.'
              : 'Try selecting a different filter above to view all of your past orders.'}
          </p>
          <div className="mt-6">
            <Link
              to="/shop/all"
              className="inline-flex items-center gap-2 rounded-full bg-maroon px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory hover:bg-maroon/90 shadow-xs transition-colors"
            >
              Start Shopping
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const orderId = order._id || order.id
            const orderNum = order.orderNumber || (orderId ? `VT-${orderId.slice(-6).toUpperCase()}` : 'VT-ORDER')
            const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }) : 'Recent'
            const isExpanded = expandedOrder === orderId
            const isCancellable = ['PENDING', 'CONFIRMED'].includes((order.orderStatus || '').toUpperCase())
            const isCod = order.paymentMethod === 'COD'

            return (
              <div
                key={orderId}
                className="overflow-hidden rounded-2xl border border-brown/10 bg-white shadow-xs transition-all hover:border-brown/20 hover:shadow-md"
              >
                {/* Header bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brown/10 bg-cream/40 px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-brown-light">
                        Order Placed
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium text-maroon">
                        <Calendar size={13} className="text-brown-light" />
                        {dateStr}
                      </span>
                    </div>
                    <div className="hidden sm:block h-6 w-px bg-brown/15" />
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-brown-light">
                        Order Number
                      </span>
                      <span className="font-mono text-xs font-bold text-maroon tracking-wider">
                        #{orderNum}
                      </span>
                    </div>
                    <div className="hidden sm:block h-6 w-px bg-brown/15" />
                    <div>
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-brown-light">
                        Total Amount
                      </span>
                      <span className="text-xs font-bold text-brown">
                        ₹{(order.total ?? order.totalAmount ?? 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.orderStatus)}
                  </div>
                </div>

                {/* Items preview list */}
                <div className="divide-y divide-brown/5 px-5 sm:px-6">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-4">
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-brown/10 bg-cream/60">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-top"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-maroon/30">
                            <Package size={22} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-base font-semibold text-brown truncate">
                          {item.name}
                        </h4>
                        <p className="mt-1 text-xs text-brown-light flex items-center gap-3">
                          <span>Qty: <strong className="text-maroon">{item.quantity}</strong></span>
                          <span>•</span>
                          <span>Price: <strong className="text-maroon">₹{(item.price || 0).toLocaleString('en-IN')}</strong></span>
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-teal flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Authentic Surat Silk & Hand-finished
                        </p>
                      </div>
                      {item.saree && (
                        <Link
                          to={`/product/${item.saree}`}
                          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
                        >
                          View Item
                          <ExternalLink size={12} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="border-t border-brown/10 bg-cream/20 px-5 py-5 sm:px-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div>
                          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brown mb-2">
                            <MapPin size={14} className="text-maroon" />
                            Shipping Address
                          </span>
                          <div className="rounded-xl border border-brown/10 bg-white p-3.5 leading-relaxed text-brown-light">
                            <p className="font-semibold text-maroon">
                              {order.shippingAddress.line1}
                            </p>
                            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                            </p>
                            <p className="font-medium text-brown mt-1">{order.shippingAddress.country || 'India'}</p>
                          </div>
                        </div>
                      )}

                      {/* Payment & Status Info */}
                      <div>
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brown mb-2">
                          <CreditCard size={14} className="text-maroon" />
                          Payment Summary
                        </span>
                        <div className="rounded-xl border border-brown/10 bg-white p-3.5 space-y-1.5 text-brown-light">
                          <div className="flex justify-between">
                            <span>Method:</span>
                            <span className="font-semibold text-maroon">
                              {isCod ? 'Cash on Delivery (COD)' : 'Prepaid (Razorpay)'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payment Status:</span>
                            <span className="font-semibold text-brown capitalize">
                              {order.paymentStatus || 'Pending'}
                            </span>
                          </div>
                          {order.couponCode && (
                            <div className="flex justify-between text-teal">
                              <span>Coupon Applied:</span>
                              <span className="font-mono font-bold">{order.couponCode}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div>
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brown mb-2">
                          <Receipt size={14} className="text-maroon" />
                          Cost Breakdown
                        </span>
                        <div className="rounded-xl border border-brown/10 bg-white p-3.5 space-y-1 text-brown-light">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{(order.subtotal || order.total || 0).toLocaleString('en-IN')}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-teal">
                              <span>Discount:</span>
                              <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee || 0}`}</span>
                          </div>
                          <div className="border-t border-brown/10 pt-1.5 flex justify-between font-bold text-maroon text-sm">
                            <span>Total Paid:</span>
                            <span>₹{(order.total ?? order.totalAmount ?? 0).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer action bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brown/10 bg-white px-5 py-3.5 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setExpandedOrder(isExpanded ? null : orderId)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-brown hover:text-maroon transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Full Details & Breakdown'}</span>
                    <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {isCancellable && (
                      <button
                        type="button"
                        onClick={() => {
                          setCancelError('')
                          setCancelModalOrder(order)
                        }}
                        className="rounded-full border border-rose-200 px-3.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}

                    <Link
                      to={`/track-order?orderId=${encodeURIComponent(orderNum)}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-maroon/10 px-4 py-1.5 text-xs font-semibold text-maroon hover:bg-maroon hover:text-ivory transition-all shadow-2xs"
                    >
                      <Truck size={13} />
                      Track Shipment
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-display text-xl text-brown">Cancel This Order?</h3>
            <p className="mt-2 text-xs leading-relaxed text-brown-light">
              Are you sure you want to cancel order #{cancelModalOrder.orderNumber || cancelModalOrder._id}?
              Any reserved sarees will be returned to stock, and your coupon code will be restored.
            </p>

            {cancelError && (
              <p className="mt-3 rounded-lg bg-rose-50 p-2 text-xs text-rose-700 font-medium">
                {cancelError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="rounded-lg border border-brown/20 px-4 py-2 text-xs font-semibold text-brown hover:bg-cream"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancellingId !== null}
                onClick={handleCancelOrder}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {cancellingId ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
