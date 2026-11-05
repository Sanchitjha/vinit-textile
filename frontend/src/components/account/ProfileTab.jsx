import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

const inputClass =
  'mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon focus:border-brown focus:outline-none'
const lockedClass =
  'mt-2 w-full border border-brown/30 bg-transparent/50 px-4 py-3 text-sm text-maroon opacity-70 cursor-not-allowed'

export default function ProfileTab({ user }) {
  const { updateProfile } = useAuth()
  const [name, setName] = useState(user.name || '')
  const [phone, setPhone] = useState(user.phone || '')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'ok' | 'error', text }

  // Details can arrive after the first render (Clerk sign-in finishing its sync)
  useEffect(() => {
    setName(user.name || '')
    setPhone(user.phone || '')
  }, [user.name, user.phone])

  const created = user.createdAt ? new Date(user.createdAt) : null
  const memberSince = created && !Number.isNaN(created.getTime()) ? created.toLocaleDateString('en-IN') : '—'

  const save = async () => {
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    if (!name.trim()) {
      setStatus({ type: 'error', text: 'Please enter your name.' })
      return
    }
    if (cleanPhone && (cleanPhone.length < 7 || cleanPhone.length > 15)) {
      setStatus({ type: 'error', text: 'Please enter a valid phone number.' })
      return
    }
    setSaving(true)
    setStatus(null)
    try {
      await updateProfile({ name: name.trim(), ...(cleanPhone ? { phone: cleanPhone } : {}) })
      setStatus({ type: 'ok', text: 'Profile updated.' })
    } catch (err) {
      setStatus({ type: 'error', text: err?.data?.message || err?.message || 'Could not save. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-maroon">Profile Details</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-brown">Full Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-brown">Email</span>
          <input value={user.email || ''} disabled readOnly className={lockedClass} />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-brown">Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-brown">Member Since</span>
          <input value={memberSince} disabled readOnly className={lockedClass} />
        </label>
      </div>
      <Button variant="primary" className="mt-6 disabled:opacity-60" disabled={saving} onClick={save}>
        {saving ? 'Saving…' : 'Save Changes'}
      </Button>
      {status && (
        <p className={`mt-3 text-sm ${status.type === 'ok' ? 'text-green-700' : 'text-red-700'}`}>{status.text}</p>
      )}
    </div>
  )
}
