import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignInButton, SignUpButton } from '@clerk/react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiClient } from '../api/client'
import { openRazorpayCheckout } from '../utils/razorpay'
import Button from '../components/ui/Button'
import Seo from '../components/seo/Seo'
import { ShieldCheckIcon, TruckIcon } from '../components/icons/Icons'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh'
]

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const { user, isCustomerLoggedIn, loading: authLoading, openAuthModal } = useAuth()

  // Addresses
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [loadingAddresses, setLoadingAddresses] = useState(false)

  // New address form state
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Gujarat',
    postalCode: '',
    country: 'India',
    isDefault: false,
  })

  // Payment method: 'RAZORPAY' or 'COD'
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY')

  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  // Checkout process state
  const [isProcessing, setIsProcessing] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [devStubNotice, setDevStubNotice] = useState(false)

  // Calculate totals
  const discountAmount = appliedCoupon?.discount || 0
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const shippingFee = taxableAmount >= 2000 ? 0 : 99
  const totalAmount = taxableAmount + shippingFee

  // Automatically prompt auth modal if user visits checkout while not logged in
  useEffect(() => {
    if (!authLoading && !isCustomerLoggedIn) {
      openAuthModal?.('login')
    }
  }, [authLoading, isCustomerLoggedIn, openAuthModal])

  // Load user saved addresses
  useEffect(() => {
    if (user) {
      setLoadingAddresses(true)
      apiClient.get('/users/addresses')
        .then((res) => {
          const list = res.data || []
          setAddresses(list)
          if (list.length > 0) {
            const def = list.find((a) => a.isDefault) || list[0]
            setSelectedAddressId(def._id || def.id)
            setIsAddingNewAddress(false)
          } else {
            setIsAddingNewAddress(true)
          }
        })
        .catch(() => {
          setIsAddingNewAddress(true)
        })
        .finally(() => setLoadingAddresses(false))
    }
  }, [user])

  // Update address name/phone when user loads
  useEffect(() => {
    if (user && !newAddress.name) {
      setNewAddress((prev) => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
      }))
    }
  }, [user])

  // Loading state while auth is determining
  if (authLoading) {
    return (
      <div className="container-ambika py-24 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-maroon border-t-transparent mb-4" />
        <p className="text-xs font-serif uppercase tracking-widest text-brown/70">
          Verifying account status...
        </p>
      </div>
    )
  }

  // If cart is empty, redirect back to cart
  if (items.length === 0) {
    return (
      <div className="container-ambika py-16 text-center">
        <h1 className="font-display text-3xl text-maroon">Your Cart is Empty</h1>
        <p className="mt-3 text-sm text-brown/70">Add exquisite sarees to your cart before proceeding to checkout.</p>
        <Link to="/shop/saree" className="mt-6 inline-block">
          <Button variant="primary">Explore Saree Collection</Button>
        </Link>
      </div>
    )
  }

  // Auth gate: disallow guest/unauthenticated checkout
  if (!isCustomerLoggedIn) {
    return (
      <section className="bg-[#FAF8F5] py-16 min-h-[70vh]">
        <Seo
          title="Sign In to Checkout — Vinit Textiles"
          description="Please sign in or create an account to proceed with checkout at Vinit Textiles."
        />
        <div className="container-ambika max-w-lg">
          <div className="bg-white rounded-2xl border border-[#EDE4DE] p-8 sm:p-10 shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon/10 text-maroon mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-maroon">
              Sign In to Checkout
            </h1>
            <p className="mt-3 text-sm text-brown/80 leading-relaxed">
              Please sign in or create an account to proceed with checkout. Your cart items are saved and ready for purchase once logged in.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#EDE4DE] text-xs text-brown/80 flex items-center justify-between">
              <span>Items in Cart: <strong className="text-maroon font-semibold">{items.reduce((acc, i) => acc + i.qty, 0)}</strong></span>
              <span>Subtotal: <strong className="text-maroon font-semibold">₹{subtotal.toLocaleString('en-IN')}</strong></span>
            </div>

            <div className="mt-8 space-y-3">
              <SignInButton mode="modal">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full justify-center py-3.5"
                >
                  Sign In to Proceed
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  type="button"
                  variant="dark"
                  className="w-full justify-center py-3"
                >
                  Create Account (Sign Up)
                </Button>
              </SignUpButton>
              <Link
                to="/cart"
                className="block w-full py-2.5 text-center text-xs uppercase tracking-widest font-medium text-brown hover:text-maroon transition-colors"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Handle coupon validation
  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    setCouponError('')
    setCouponLoading(true)

    try {
      const res = await apiClient.post('/coupons/validate', {
        code: couponInput.trim().toUpperCase(),
        orderValue: subtotal,
      })
      setAppliedCoupon({
        code: couponInput.trim().toUpperCase(),
        discount: res.data?.discount || 0,
      })
      setCouponInput('')
    } catch (err) {
      setCouponError(err?.data?.message || err?.message || 'Invalid or expired coupon code')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponError('')
  }

  // Handle Order Placement & Razorpay execution
  const handlePlaceOrder = async () => {
    setCheckoutError('')

    if (!isCustomerLoggedIn) {
      openAuthModal('login')
      return
    }

    let finalAddressId = selectedAddressId

    // If filling a new address, validate and save it first
    if (isAddingNewAddress || !selectedAddressId) {
      if (!newAddress.name.trim()) {
        setCheckoutError('Please enter recipient name')
        return
      }
      if (!newAddress.phone.trim() || newAddress.phone.trim().length < 10) {
        setCheckoutError('Please enter a valid 10-digit mobile number')
        return
      }
      if (!newAddress.addressLine1.trim()) {
        setCheckoutError('Please enter delivery street address')
        return
      }
      if (!newAddress.city.trim()) {
        setCheckoutError('Please enter city')
        return
      }
      if (!newAddress.postalCode.trim() || newAddress.postalCode.trim().length < 6) {
        setCheckoutError('Please enter a valid 6-digit PIN code')
        return
      }

      try {
        setIsProcessing(true)
        const addRes = await apiClient.post('/users/addresses', newAddress)
        const updatedList = addRes.data || []
        setAddresses(updatedList)
        const created = updatedList[updatedList.length - 1]
        finalAddressId = created?._id || created?.id
      } catch (err) {
        setIsProcessing(false)
        setCheckoutError(err?.data?.message || 'Failed to save shipping address')
        return
      }
    }

    if (!finalAddressId) {
      setCheckoutError('Please select or add a delivery address')
      return
    }

    setIsProcessing(true)

    try {
      // 1. Create order on the backend
      const orderPayload = {
        items: items.map((item) => ({
          sareeId: item.product._id || item.product.id,
          quantity: item.qty,
        })),
        addressId: finalAddressId,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      }

      const orderRes = await apiClient.post('/orders', orderPayload)
      const order = orderRes.data

      // 2. Handle COD orders
      if (paymentMethod === 'COD') {
        clearCart()
        navigate(`/order-success/${order._id || order.id}`, {
          state: { order, isCod: true }
        })
        return
      }

      // 3. Handle RAZORPAY online payments
      const initiateRes = await apiClient.post(`/payments/${order._id || order.id}/initiate`)
      const paymentData = initiateRes.data

      const isStubMode = !paymentData.keyId || paymentData.keyId === 'stub_key'

      if (isStubMode) {
        // Backend Razorpay credentials not configured in .env -> exercises the stub flow
        setDevStubNotice(true)
        setTimeout(async () => {
          try {
            await apiClient.post('/payments/verify', {
              providerOrderId: paymentData.providerOrderId,
              providerPaymentId: `stub_pay_${Date.now()}`,
              signature: 'stub_signature',
            })
            clearCart()
            navigate(`/order-success/${order._id || order.id}`, {
              state: { order, isStub: true }
            })
          } catch (verifyErr) {
            setIsProcessing(false)
            setCheckoutError(verifyErr?.data?.message || 'Failed to confirm payment simulation')
          }
        }, 1200)
        return
      }

      // 4. Open Razorpay modal with real credentials
      const activeAddress = addresses.find((a) => (a._id || a.id) === finalAddressId) || newAddress

      await openRazorpayCheckout({
        order,
        paymentData,
        user,
        address: activeAddress,
        onSuccess: async (verifyPayload) => {
          try {
            await apiClient.post('/payments/verify', verifyPayload)
            clearCart()
            navigate(`/order-success/${order._id || order.id}`, {
              state: { order }
            })
          } catch (err) {
            setIsProcessing(false)
            setCheckoutError(err?.data?.message || 'Payment verification failed. Please reach support with your Order ID.')
          }
        },
        onError: (err) => {
          setIsProcessing(false)
          setCheckoutError(err.message || 'Payment was unsuccessful. Please try again.')
        },
        onDismiss: () => {
          setIsProcessing(false)
          setCheckoutError('Payment window was closed. You can retry paying to confirm your saree order.')
        },
      })
    } catch (err) {
      setIsProcessing(false)
      setCheckoutError(err?.data?.message || err?.message || 'Could not complete order. Please review your cart and details.')
    }
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16 text-[#332421]">
      <Seo title="Checkout — Vinit Textiles" description="Secure payment & checkout for your handcrafted sarees." noindex />

      <div className="container-ambika max-w-6xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="mb-8 border-b border-[#E8DDD5] pb-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone">
            <Link to="/cart" className="hover:text-maroon transition-colors">Cart</Link>
            <span>/</span>
            <span className="font-semibold text-maroon">Checkout</span>
            <span>/</span>
            <span>Confirmation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-maroon mt-3">
            Secure Checkout
          </h1>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Address & Payment Selection */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Delivery Address */}
            <section className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#F0E8E2] pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-maroon text-xs font-bold text-ivory">
                    1
                  </span>
                  <h2 className="font-serif text-xl font-bold text-maroon">Delivery Address</h2>
                </div>
                {user && addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                    className="text-xs font-semibold text-brown hover:text-maroon underline tracking-wider cursor-pointer"
                  >
                    {isAddingNewAddress ? 'Select Saved Address' : '+ Add New Address'}
                  </button>
                )}
              </div>

              {loadingAddresses ? (
                <p className="text-xs text-stone">Loading saved addresses...</p>
              ) : user && addresses.length > 0 && !isAddingNewAddress ? (
                /* Saved addresses list */
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const id = addr._id || addr.id
                    const isSelected = selectedAddressId === id
                    return (
                      <label
                        key={id}
                        className={`block p-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-maroon bg-[#FBF5F2] ring-1 ring-maroon'
                            : 'border-[#EDE4DE] hover:border-brown/40'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="deliveryAddress"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(id)}
                            className="mt-1 accent-maroon"
                          />
                          <div className="text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-maroon">{addr.name}</span>
                              {addr.isDefault && (
                                <span className="bg-gold/20 text-[#8B5A00] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#735D59] mt-1">
                              {addr.addressLine1}
                              {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                            </p>
                            <p className="text-xs text-[#735D59]">
                              {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                            <p className="text-xs text-maroon font-medium mt-1">Mobile: {addr.phone}</p>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              ) : (
                /* New address form */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brown">Full Name *</span>
                      <input
                        type="text"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        placeholder="e.g. Sanchit Jha"
                        className="mt-1.5 w-full rounded-md border border-[#D8C7BC] bg-white px-3.5 py-2.5 text-sm text-[#332421] focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brown">10-Digit Mobile *</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="9876543210"
                        className="mt-1.5 w-full rounded-md border border-[#D8C7BC] bg-white px-3.5 py-2.5 text-sm text-[#332421] focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brown">Street Address / House No. *</span>
                    <input
                      type="text"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      placeholder="Flat, House no., Building, Apartment, Area"
                      className="mt-1.5 w-full rounded-md border border-[#D8C7BC] bg-white px-3.5 py-2.5 text-sm text-[#332421] focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-brown">Landmark / Suite (Optional)</span>
                    <input
                      type="text"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      placeholder="Near City Temple, Opposite Landmark"
                      className="mt-1.5 w-full rounded-md border border-[#D8C7BC] bg-white px-3.5 py-2.5 text-sm text-[#332421] focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                    />
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brown">City *</span>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="Surat"
                        className="mt-1.5 w-full rounded-md border border-[#D8C7BC] bg-white px-3.5 py-2.5 text-sm text-[#332421] focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brown">State *</span>
                      <select
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="mt-1.5 w-full rounded-md border border-[#D8C7BC] bg-white px-3.5 py-2.5 text-sm text-[#332421] focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brown">Pincode *</span>
                      <input
                        type="text"
                        maxLength={6}
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value.replace(/\D/g, '') })}
                        placeholder="395002"
                        className="mt-1.5 w-full rounded-md border border-[#D8C7BC] bg-white px-3.5 py-2.5 text-sm text-[#332421] focus:border-maroon focus:outline-none focus:ring-1 focus:ring-maroon"
                      />
                    </label>
                  </div>
                </div>
              )}
            </section>

            {/* Step 2: Payment Method */}
            <section className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 border-b border-[#F0E8E2] pb-4 mb-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-maroon text-xs font-bold text-ivory">
                  2
                </span>
                <h2 className="font-serif text-xl font-bold text-maroon">Payment Method</h2>
              </div>

              <div className="space-y-4">
                {/* Razorpay Option */}
                <label
                  className={`block p-5 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-maroon bg-[#FBF5F2] ring-1 ring-maroon'
                      : 'border-[#EDE4DE] hover:border-brown/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="mt-1 accent-maroon"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-semibold text-maroon text-base">
                          Online Payment (Cards, UPI, NetBanking, Wallets)
                        </span>
                        <span className="bg-teal/10 text-teal text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-[#735D59] mt-1">
                        Secure instant checkout powered by <strong>Razorpay</strong>. Supports Google Pay, PhonePe, Paytm, Visa, Mastercard, RuPay & all major banks.
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-[#4A1D1B] font-medium">
                        <ShieldCheckIcon className="w-4 h-4 text-teal" />
                        <span>256-Bit Bank Grade SSL Encryption • 100% Buyer Protection</span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`block p-5 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-maroon bg-[#FBF5F2] ring-1 ring-maroon'
                      : 'border-[#EDE4DE] hover:border-brown/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-1 accent-maroon"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-maroon text-base">Cash on Delivery (COD)</span>
                      <p className="text-xs text-[#735D59] mt-1">
                        Pay cash or UPI directly to the courier agent upon doorstep delivery.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5">
            <aside className="bg-white rounded-xl border border-[#EDE4DE] p-6 sm:p-8 shadow-xs sticky top-24">
              <h3 className="font-serif text-xl font-bold text-maroon border-b border-[#F0E8E2] pb-4">
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items List */}
              <div className="divide-y divide-[#F0E8E2] max-h-64 overflow-y-auto my-4 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.key} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.images?.[0] || item.product.image || '/placeholder.webp'}
                      alt={item.product.name}
                      className="h-14 w-12 object-cover rounded bg-[#F5EDE6] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-maroon truncate">{item.product.name}</p>
                      <p className="text-[11px] text-stone mt-0.5">
                        Qty: {item.qty} × ₹{item.product.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-maroon">
                      ₹{(item.qty * item.product.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="border-t border-[#F0E8E2] pt-4 mb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-teal/10 border border-teal/30 p-2.5 rounded-lg text-xs">
                    <div>
                      <span className="font-bold text-teal tracking-wider uppercase">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-teal/80 ml-2">(-₹{appliedCoupon.discount})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-stone hover:text-maroon font-semibold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo / Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 rounded-md border border-[#D8C7BC] bg-[#FAF7F2] px-3 py-2 text-xs uppercase tracking-wider text-maroon focus:border-maroon focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="bg-brown text-ivory px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-maroon transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-xs text-red-600 mt-1.5">{couponError}</p>}
              </div>

              {/* Bill Details */}
              <dl className="space-y-2.5 text-xs text-[#735D59] border-t border-[#F0E8E2] pt-4">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-maroon">₹{subtotal.toLocaleString('en-IN')}</dd>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-teal">
                    <dt>Coupon Discount</dt>
                    <dd className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="flex items-center gap-1.5">
                    <span>Delivery Charges</span>
                    {shippingFee === 0 && (
                      <span className="text-[10px] bg-teal/10 text-teal px-1.5 py-0.2 rounded font-semibold">FREE</span>
                    )}
                  </dt>
                  <dd className="font-semibold text-maroon">
                    {shippingFee === 0 ? '₹0' : `₹${shippingFee}`}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-[#E8DDD5] pt-3 text-base font-bold text-maroon">
                  <dt>Total Amount</dt>
                  <dd>₹{totalAmount.toLocaleString('en-IN')}</dd>
                </div>
              </dl>

              {/* Error Notice */}
              {checkoutError && (
                <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                  {checkoutError}
                </div>
              )}

              {/* Dev Stub simulation notice */}
              {devStubNotice && (
                <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                  <span className="font-bold">Dev Mode:</span> Razorpay keys are not yet configured in backend .env. Simulating instant payment confirmation...
                </div>
              )}

              {/* Place Order CTA */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="mt-6 w-full rounded-none bg-maroon py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-ivory hover:bg-brown transition-colors shadow-xs disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>Processing Order...</>
                ) : paymentMethod === 'RAZORPAY' ? (
                  <>
                    <ShieldCheckIcon className="w-4 h-4 text-gold" />
                    Pay ₹{totalAmount.toLocaleString('en-IN')} via Razorpay
                  </>
                ) : (
                  <>Place COD Order (₹{totalAmount.toLocaleString('en-IN')})</>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-stone">
                <span className="flex items-center gap-1">
                  <TruckIcon className="w-3.5 h-3.5 text-brown" />
                  Free shipping above ₹2,000
                </span>
                <span>•</span>
                <span>7-Day Return Guarantee</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
