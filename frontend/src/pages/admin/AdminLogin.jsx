import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { ShieldCheckIcon } from '../../components/icons/Icons'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user, login, loading } = useAuth()
  const [form, setForm] = useState({ email: 'admin@vinittextiles.com', password: 'admin123' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div className="flex h-screen items-center justify-center font-serif text-lg">Loading...</div>
  if (user && user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    if (event) event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const loggedInUser = await login(form.email, form.password)
      if (loggedInUser.role !== 'ADMIN') {
        setError('You are not authorized as an Admin.')
      } else {
        navigate('/admin')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#FFEAE5] text-[#C44331] flex items-center justify-center mb-3 shadow-xs">
          <ShieldCheckIcon className="w-7 h-7" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C44331]">Vinit Textiles</p>
        <h2 className="mt-1 text-center text-3xl font-serif font-bold text-[#4A1D1B]">
          Admin Portal Login
        </h2>
        <p className="mt-1 text-xs text-[#7A615C]">
          Manage your sarees, inventory, categories, and customer orders
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-[#EDE4DE] sm:px-10">
          {/* Quick Credentials Info Box */}
          <div className="mb-6 rounded-xl bg-[#FFF4F0] border border-[#FADCD5] p-3.5 text-xs text-[#6C5551]">
            <p className="font-bold text-[#4A1D1B] mb-1 flex items-center gap-1.5">
              <span>🔑</span> Default Admin Access Credentials:
            </p>
            <p className="font-mono text-[11px] text-[#801B1A]">
              Email: <strong>admin@vinittextiles.com</strong><br />
              Password: <strong>admin123</strong>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A1D1B]">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                  className="appearance-none block w-full px-3.5 py-2.5 border border-[#D9CBC3] rounded-lg shadow-2xs placeholder-gray-400 focus:outline-hidden focus:border-[#801B1A] sm:text-sm bg-[#FAF7F2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A1D1B]">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={update('password')}
                  className="appearance-none block w-full px-3.5 py-2.5 border border-[#D9CBC3] rounded-lg shadow-2xs placeholder-gray-400 focus:outline-hidden focus:border-[#801B1A] sm:text-sm bg-[#FAF7F2]"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#801B1A] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#681312] transition-colors shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Authenticating...' : 'Sign In To Admin Portal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
