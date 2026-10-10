import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'
import { useAdminTheme } from '../../context/AdminThemeContext'
import { Plus, Trash2, X, Check, Tag, Search, Loader2 } from 'lucide-react'

export default function AdminCoupons() {
  const { isDarkMode } = useAdminTheme()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderValue: '',
    expiresAt: '',
    isActive: true
  })

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/coupons')
      setCoupons(res.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minimumOrderValue: Number(formData.minimumOrderValue || 0),
        expiresAt: formData.expiresAt,
        isActive: Boolean(formData.isActive)
      }
      await apiClient.post('/coupons', payload)
      setIsFormOpen(false)
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minimumOrderValue: '',
        expiresAt: '',
        isActive: true
      })
      fetchCoupons()
      showToast('Coupon created successfully!')
    } catch (err) {
      alert(err.message || 'Failed to create coupon')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon code "${code}"?`)) return
    try {
      await apiClient.delete(`/coupons/${id}`)
      fetchCoupons()
      showToast(`Coupon "${code}" deleted.`)
    } catch (err) {
      alert(err.message || 'Failed to delete coupon')
    }
  }

  const filteredCoupons = coupons.filter(c => 
    c.code?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold animate-bounce">
          <Check size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Discount Coupons & Vouchers ({filteredCoupons.length})
          </h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Create promotional codes, percentage discounts, and minimum order qualifiers
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.35)] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className={`p-4 rounded-2xl border transition-colors flex items-center gap-3 ${
        isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by coupon promo code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition-colors ${
              isDarkMode 
                ? 'bg-[#080C14] border-[#1C273E] text-white placeholder-slate-500 focus:border-purple-500/60' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500'
            }`}
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${
                isDarkMode ? 'bg-[#0B0F19]/80 border-[#1C273E] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <th className="py-3.5 px-4 font-semibold">Promo Code</th>
                <th className="py-3.5 px-4 font-semibold">Discount</th>
                <th className="py-3.5 px-4 font-semibold">Min Order</th>
                <th className="py-3.5 px-4 font-semibold">Valid Until</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#1C273E]' : 'divide-slate-100'}`}>
              {filteredCoupons.map((coupon) => {
                const couponId = coupon._id || coupon.id
                return (
                  <tr key={couponId} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                          <Tag size={15} />
                        </div>
                        <span className={`font-mono font-bold text-xs ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                          {coupon.code}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                    </td>
                    <td className={`py-3.5 px-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      ₹{coupon.minimumOrderValue || 0}
                    </td>
                    <td className={`py-3.5 px-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No expiry'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        coupon.isActive !== false
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {coupon.isActive !== false ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(couponId, coupon.code)}
                        className={`p-1.5 rounded-lg border text-rose-400 hover:text-white transition-all ${
                          isDarkMode ? 'bg-rose-950/30 border-rose-500/30 hover:bg-rose-600' : 'bg-rose-50 border-rose-200 hover:bg-rose-600'
                        }`}
                        title="Delete coupon"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}

              {!loading && filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan="6" className={`py-12 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all ${
            isDarkMode ? 'bg-[#0B0F19] border-[#1C273E]' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-6 border-b flex items-center justify-between ${
              isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Tag size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Create Promotion Code
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Configure voucher value and expiry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className={`p-2 rounded-xl transition-colors ${
                  isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. FESTIVE20"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono uppercase outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Value *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                      isDarkMode 
                        ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Minimum Order Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimumOrderValue}
                  onChange={(e) => setFormData({ ...formData, minimumOrderValue: e.target.value })}
                  placeholder="e.g. 1999"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Expiration Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-slate-800/50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(124,58,237,0.35)] disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  <span>Save Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
