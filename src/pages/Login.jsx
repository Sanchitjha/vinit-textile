import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import Button from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/account')
  }

  return (
    <AuthShell tone="brown" label="Woman in festive saree — welcome back">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Welcome Back</p>
      <h1 className="font-display mt-3 text-3xl text-maroon">Log In to Ambika</h1>
      <p className="mt-3 text-sm leading-relaxed text-brown/80">
        Log in to access your personalised saree collection and experience the grace of timeless
        women&apos;s fashion.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-brown">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            className="mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-brown">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={update('password')}
            placeholder="••••••••"
            className="mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
          />
        </label>

        <div className="flex items-center justify-between text-xs text-brown">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-brown" />
            Remember me
          </label>
          <a href="#" className="hover:text-maroon hover:underline">
            Forgot password?
          </a>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Log In
        </Button>
      </form>

      <p className="mt-6 text-sm text-brown/80">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-maroon hover:underline">
          Sign up
        </Link>
      </p>
    </AuthShell>
  )
}
