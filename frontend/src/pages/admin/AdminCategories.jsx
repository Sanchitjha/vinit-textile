import { useState, useEffect } from 'react'
import { apiClient } from '../../api/client'
import { useAdminTheme } from '../../context/AdminThemeContext'
import { Plus, Trash2, X, Check, Layers, Search, Loader2 } from 'lucide-react'

export default function AdminCategories() {
  const { isDarkMode } = useAdminTheme()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true })
  const [toast, setToast] = useState(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/categories')
      setCategories(res.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await apiClient.post('/categories', formData)
      setIsFormOpen(false)
      setFormData({ name: '', description: '', isActive: true })
      fetchCategories()
      showToast('Category created successfully!')
    } catch (err) {
      alert(err.message || 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Sarees assigned to this category may be affected.`)) return
    try {
      await apiClient.delete(`/categories/${id}`)
      fetchCategories()
      showToast(`Category "${name}" deleted.`)
    } catch (err) {
      alert(err.message || 'Failed to delete category')
    }
  }

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
            Categories Catalog ({filteredCategories.length})
          </h2>
          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Organize silk sarees, cotton weaves, designer bridal collections and festive ranges
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.35)] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Add Category</span>
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
            placeholder="Search categories by name or description..."
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

      {/* Categories Table */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#0E1424] border-[#1C273E]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b ${
                isDarkMode ? 'bg-[#0B0F19]/80 border-[#1C273E] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <th className="py-3.5 px-4 font-semibold">Category Name</th>
                <th className="py-3.5 px-4 font-semibold">Description</th>
                <th className="py-3.5 px-4 font-semibold">Slug</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#1C273E]' : 'divide-slate-100'}`}>
              {filteredCategories.map((cat) => {
                const catId = cat._id || cat.id
                return (
                  <tr key={catId} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                          <Layers size={15} />
                        </div>
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 max-w-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {cat.description || '—'}
                    </td>
                    <td className={`py-3.5 px-4 font-mono text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cat.isActive !== false
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {cat.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(catId, cat.name)}
                        className={`p-1.5 rounded-lg border text-rose-400 hover:text-white transition-all ${
                          isDarkMode ? 'bg-rose-950/30 border-rose-500/30 hover:bg-rose-600' : 'bg-rose-50 border-rose-200 hover:bg-rose-600'
                        }`}
                        title="Delete category"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}

              {!loading && filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="5" className={`py-12 text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
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
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Create Category
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Add a new category classification
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bridal Kanjeevaram"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of this collection's styles..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-colors ${
                    isDarkMode 
                      ? 'bg-[#080C14] border-[#1C273E] text-white focus:border-purple-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500'
                  }`}
                />
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDarkMode ? 'bg-[#080C14] border-[#1C273E]' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Active Status
                </span>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
