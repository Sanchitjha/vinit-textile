import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/layout/AuthShell'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function SignUp() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      navigate('/account')
    } catch (err) {
      setError(err.message || 'Signup failed')
    }
  }

  return (
    <AuthShell tone="mauve" label="Bridal editorial — join the club">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brown-light">Join The Club</p>
      <h1 className="font-display mt-4 text-4xl text-brown">Create Your Account</h1>
      <p className="mt-4 text-sm leading-relaxed text-brown-light">
        Sign up for early access to new arrivals, festive edits and members-only offers.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-brown">Full Name</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={update('name')}
            placeholder="Riya Sharma"
            className="mt-3 w-full rounded-none border border-brown/20 bg-transparent px-5 py-3.5 text-[13px] text-brown placeholder:text-brown-light focus:border-brown focus:outline-none"
          />
        </label>

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
          <span className="text-[10px] font-semibold uppercase tracking-widest text-brown">Phone</span>
          <input
            type="tel"
            required
            minLength={7}
            maxLength={15}
            value={form.phone}
            onChange={update('phone')}
            placeholder="+91 9876543210"
            className="mt-3 w-full rounded-none border border-brown/20 bg-transparent px-5 py-3.5 text-[13px] text-brown placeholder:text-brown-light focus:border-brown focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-2 gap-6">
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
          <label className="block">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brown">Confirm</span>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={update('confirm')}
              placeholder="••••••••"
              className="mt-3 w-full rounded-none border border-brown/20 bg-transparent px-5 py-3.5 text-[13px] text-brown placeholder:text-brown-light focus:border-brown focus:outline-none"
            />
          </label>
        </div>

        {error && <p className="text-[11px] font-medium text-red-700">{error}</p>}

        <div className="pt-2">
          <Button type="submit" variant="primary" className="w-full">
            Sign Up
          </Button>
        </div>
      </form>

      <p className="mt-8 text-sm text-brown-light">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brown hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}
