import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { CloseIcon } from '../icons/Icons'
import Button from '../ui/Button'

const RESEND_COOLDOWN_S = 30

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, sendOtp, verifyOtp } = useAuth()

  // step: 'email' -> enter address, 'code' -> enter the 6-digit code we emailed
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (!authModalOpen) {
      // Reset once the close animation would be done, so reopening always starts fresh.
      const timeout = setTimeout(() => {
        setStep('email')
        setEmail('')
        setCode('')
        setError('')
        setCooldown(0)
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [authModalOpen])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  if (!authModalOpen) return null

  const requestCode = async (event) => {
    event?.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendOtp(email)
      setStep('code')
      setCooldown(RESEND_COOLDOWN_S)
    } catch (err) {
      setError(err?.message || 'Could not send the code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const confirmCode = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyOtp(email, code)
      closeAuthModal()
    } catch (err) {
      setError(err?.message || 'That code didn’t work. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-ivory p-8 shadow-card">
        <button
          type="button"
          aria-label="Close"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 text-brown hover:text-maroon"
        >
          <CloseIcon />
        </button>

        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Vinit Textiles
        </p>
        <h2 className="font-display mt-2 text-center text-2xl text-maroon">Log In Or Sign Up</h2>

        {step === 'email' ? (
          <form onSubmit={requestCode} className="mt-6 space-y-4">
            <p className="text-center text-sm text-brown/80">
              We&apos;ll email you a 6-digit code — no password needed.
            </p>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-brown">Email</span>
              <input
                required
                type="email"
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
              />
            </label>

            {error && <p className="text-xs font-medium text-vermillion">{error}</p>}

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Get Code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={confirmCode} className="mt-6 space-y-4">
            <p className="text-center text-sm text-brown/80">
              Enter the code sent to <span className="font-semibold text-maroon">{email}</span>
            </p>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-brown">6-digit code</span>
              <input
                required
                type="text"
                inputMode="numeric"
                autoFocus
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="••••••"
                className="mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-center text-xl tracking-[0.5em] text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
              />
            </label>

            {error && <p className="text-xs font-medium text-vermillion">{error}</p>}

            <Button type="submit" variant="primary" className="w-full" disabled={loading || code.length !== 6}>
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </Button>

            <div className="flex items-center justify-between text-xs text-brown/70">
              <button type="button" onClick={() => setStep('email')} className="hover:text-maroon hover:underline">
                Change email
              </button>
              <button
                type="button"
                onClick={requestCode}
                disabled={cooldown > 0}
                className="hover:text-maroon hover:underline disabled:cursor-not-allowed disabled:text-stone disabled:no-underline"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
