import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AuthModal from './components/layout/AuthModal'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import SearchResults from './pages/SearchResults'
import Cart from './pages/Cart'
import Account from './pages/Account'
import About from './pages/About'
import Contact from './pages/Contact'
import SizeChart from './pages/SizeChart'
import ShippingDelivery from './pages/ShippingDelivery'
import TrackOrder from './pages/TrackOrder'
import CustomerReviews from './pages/CustomerReviews'
import ReturnsPolicy from './pages/ReturnsPolicy'
import Faqs from './pages/Faqs'
import Stores from './pages/Stores'
import Franchise from './pages/Franchise'
import Blog from './pages/Blog'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import NotFound from './pages/NotFound'

// Admin imports — lazy-loaded so recharts and the admin screens (never seen by
// customers) aren't in the bundle every shopper downloads on the storefront.
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // The static <head> tags in index.html (marked data-default) are a fallback
  // for link-preview bots that don't run JS. Once React has mounted and every
  // page's <Seo> has registered its own tags via react-helmet-async, drop the
  // static ones so browsers/Googlebot don't see duplicates.
  useEffect(() => {
    document.querySelectorAll('[data-default="true"]').forEach((el) => el.remove())
  }, [])

  return (
    <CartProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        {!isAdminRoute && <Header />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/shop/:category" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/size-chart" element={<SizeChart />} />
            <Route path="/shipping-delivery" element={<ShippingDelivery />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/reviews" element={<CustomerReviews />} />
            <Route path="/returns" element={<ReturnsPolicy />} />
            <Route path="/returns-policy" element={<ReturnsPolicy />} />
            <Route path="/faqs" element={<Faqs />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/franchise" element={<Franchise />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            
            {/* Admin Routes */}
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={null}>
                  <AdminLogin />
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <Suspense fallback={null}>
                  <AdminLayout />
                </Suspense>
              }
            >
              <Route index element={<Suspense fallback={null}><AdminDashboard /></Suspense>} />
              <Route path="products" element={<Suspense fallback={null}><AdminProducts /></Suspense>} />
              <Route path="categories" element={<Suspense fallback={null}><AdminCategories /></Suspense>} />
              <Route path="orders" element={<Suspense fallback={null}><AdminOrders /></Suspense>} />
              <Route path="coupons" element={<Suspense fallback={null}><AdminCoupons /></Suspense>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
      {!isAdminRoute && <AuthModal />}
    </CartProvider>
  )
}
