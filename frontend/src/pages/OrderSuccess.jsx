import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { apiClient } from '../api/client'
import Seo from '../components/seo/Seo'
import Button from '../components/ui/Button'
import { ShieldCheckIcon, TruckIcon } from '../components/icons/Icons'

export default function OrderSuccess() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!order)

  useEffect(() => {
    if (!order && id) {
      apiClient.get(`/orders/${id}`)
        .then((res) => setOrder(res.data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [id, order])

  const orderNumber = order?.orderNumber || (id ? `#${id.slice(-6).toUpperCase()}` : '#VT-ORDER')
  const isCod = location.state?.isCod || order?.paymentMethod === 'COD'

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12 sm:py-20 text-[#332421]">
      <Seo title="Order Confirmed — Vinit Textiles" description="Thank you for your order with Vinit Textiles." noindex />

      <div className="container-ambika max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-[#EDE4DE] p-8 sm:p-12 shadow-sm text-center">
          {/* Success Badge */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/15 text-teal mb-6">
            <ShieldCheckIcon className="w-10 h-10 text-teal" />
          </div>

          <p className="text-xs uppercase tracking-[0.25em] text-[#C44331] font-semibold">
            {isCod ? 'Order Placed Successfully' : 'Payment Confirmed & Verified'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon mt-2">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-[#735D59] mt-3 max-w-md mx-auto">
            Your handcrafted saree order has been received. Our weavers and quality team are preparing it for packaging & dispatch.
          </p>

          {/* Order Details Box */}
          <div className="mt-8 bg-[#FAF7F2] rounded-xl border border-[#EDE4DE] p-5 text-left text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-[#E8DDD5] pb-3">
              <div>
                <span className="text-[#8B736F] text-[11px] block">Order Number</span>
                <span className="font-mono font-bold text-maroon text-base">{orderNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[#8B736F] text-[11px] block">Payment Method</span>
                <span className="font-semibold text-maroon">
                  {isCod ? 'Cash on Delivery' : 'Razorpay (Prepaid)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div>
                <span className="text-[#8B736F] text-[11px] block">Estimated Delivery</span>
                <span className="font-semibold text-maroon">Within 3–5 Business Days</span>
              </div>
              <div className="text-right">
                <span className="text-[#8B736F] text-[11px] block">Shipping Method</span>
                <span className="font-semibold text-teal flex items-center justify-end gap-1">
                  <TruckIcon className="w-3.5 h-3.5" /> Express Hub Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/track-order" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Track Order
              </Button>
            </Link>
            <Link to="/orders" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full">
                View in My Orders
              </Button>
            </Link>
          </div>

          <div className="mt-6">
            <Link
              to="/shop/saree"
              className="text-xs uppercase tracking-widest font-semibold text-brown hover:text-maroon underline transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
