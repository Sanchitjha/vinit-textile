import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Sparkles, ShieldCheck, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user, login, loading } = useAuth()
  const [form, setForm] = useState({ email: 'admin@vinittextiles.com', password: 'admin123' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080C14] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading Vinit Textiles Portal...</p>
        </div>
      </div>
    )
  }

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
      if (loggedInUser?.role !== 'ADMIN') {
        setError('You are not authorized as an Admin.')
      } else {
        navigate('/admin', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-[0_0_25px_rgba(147,51,234,0.5)] flex items-center justify-center text-white mb-3">
            <div className="w-full h-full rounded-[14px] bg-[#0B0F19]/40 flex items-center justify-center">
              <Sparkles size={26} className="text-white" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Vinit Textiles</h1>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 tracking-wider">
              PORTAL
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Operations & Admin Console Authentication
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0E1424] border border-[#1C273E] p-8 rounded-3xl shadow-2xl space-y-5">
          {/* Quick info credentials */}
          <div className="bg-[#121B2F] border border-[#1F2E4C] rounded-2xl p-3.5 text-xs text-slate-300">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Default Admin Credentials
              </span>
              <button
                type="button"
                onClick={() => setForm({ email: 'admin@vinittextiles.com', password: 'admin123' })}
                className="text-[10px] text-purple-400 hover:text-purple-300 underline font-medium"
              >
                Auto-fill
              </button>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              admin@vinittextiles.com / admin123
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                  placeholder="admin@vinittextiles.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080C14] border border-[#1C273E] rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={update('password')}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#080C14] border border-[#1C273E] rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs text-rose-300 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Admin Console</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Return to Live Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}
