import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await login(form.email, form.password)
      navigate('/account')
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <AuthShell tone="brown" label="Woman in festive saree — welcome back">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brown-light">Welcome Back</p>
      <h1 className="font-display mt-4 text-4xl text-brown">Log In to Vinit Textiles</h1>
      <p className="mt-4 text-sm leading-relaxed text-brown-light">
        Log in to access your personalised saree collection and experience the grace of timeless
        women&apos;s fashion.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-brown">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            className="mt-3 w-full rounded-none border border-brown/20 bg-transparent px-5 py-3.5 text-[13px] text-brown placeholder:text-brown-light focus:border-brown focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-brown">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={update('password')}
            placeholder="••••••••"
            className="mt-3 w-full rounded-none border border-brown/20 bg-transparent px-5 py-3.5 text-[13px] text-brown placeholder:text-brown-light focus:border-brown focus:outline-none"
          />
        </label>

        <div className="flex items-center justify-between text-[11px] font-medium text-brown-light">
          <label className="flex cursor-pointer items-center gap-3 hover:text-brown transition-colors">
            <input type="checkbox" className="h-4 w-4 rounded-none border-brown/20 accent-brown bg-transparent" />
            Remember me
          </label>
          <a href="#" className="hover:text-brown transition-colors">
            Forgot password?
          </a>
        </div>

        {error && <p className="text-[11px] font-medium text-red-700">{error}</p>}

        <div className="pt-2">
          <Button type="submit" variant="primary" className="w-full">
            Log In
          </Button>
        </div>
      </form>

      <p className="mt-8 text-sm text-brown-light">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-brown hover:underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  )
}
