import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import Button from '../components/ui/Button'

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    navigate('/account')
  }

  return (
    <AuthShell tone="mauve" label="Bridal editorial — join the club">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Join The Club</p>
      <h1 className="font-display mt-3 text-3xl text-maroon">Create Your Account</h1>
      <p className="mt-3 text-sm leading-relaxed text-brown/80">
        Sign up for early access to new arrivals, festive edits and members-only offers.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-brown">Full Name</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={update('name')}
            placeholder="Riya Sharma"
            className="mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
          />
        </label>

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

        <div className="grid grid-cols-2 gap-4">
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
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-brown">Confirm</span>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={update('confirm')}
              placeholder="••••••••"
              className="mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
            />
          </label>
        </div>

        {error && <p className="text-xs font-medium text-red-700">{error}</p>}

        <Button type="submit" variant="primary" className="w-full">
          Sign Up
        </Button>
      </form>

      <p className="mt-6 text-sm text-brown/80">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-maroon hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}
