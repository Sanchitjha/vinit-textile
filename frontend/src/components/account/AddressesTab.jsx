import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { apiClient } from '../../api/client'

const inputClass =
  'mt-2 w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon focus:border-brown focus:outline-none'

const emptyAddress = (user) => ({
  name: user.name || '',
  phone: user.phone || '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'Gujarat',
  postalCode: '',
  country: 'India',
  isDefault: false,
})

const idOf = (a) => a._id || a.id

export default function AddressesTab({ user }) {
  const [addresses, setAddresses] = useState(null) // null while loading
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(() => emptyAddress(user))
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    apiClient
      .get('/users/addresses')
      .then((res) => {
        if (!cancelled) setAddresses(res.data || [])
      })
      .catch((err) => {
        if (cancelled) return
        setAddresses([])
        setError(err?.data?.message || 'Could not load your saved addresses. Please sign in again.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  // Every action returns the full, updated address list
  const run = async (action) => {
    setBusy(true)
    setError('')
    try {
      const res = await action()
      setAddresses(res.data || [])
      return true
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Something went wrong. Please try again.')
      return false
    } finally {
      setBusy(false)
    }
  }

  const add = async (e) => {
    e.preventDefault()
    const phone = form.phone.replace(/\D/g, '')
    if (!form.name.trim()) return setError('Please enter the recipient name.')
    if (phone.length < 10) return setError('Please enter a valid 10-digit mobile number.')
    if (!form.addressLine1.trim()) return setError('Please enter the street address.')
    if (!form.city.trim() || !form.state.trim()) return setError('Please enter city and state.')
    if (!/^[1-9]\d{5}$/.test(form.postalCode.trim())) return setError('Please enter a valid 6-digit PIN code.')

    const ok = await run(() =>
      apiClient.post('/users/addresses', {
        ...form,
        name: form.name.trim(),
        phone,
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        isDefault: form.isDefault || (addresses || []).length === 0,
      })
    )
    if (ok) {
      setAdding(false)
      setForm(emptyAddress(user))
    }
  }

  const makeDefault = (a) => run(() => apiClient.patch(`/users/addresses/${idOf(a)}`, { isDefault: true }))

  const remove = (a) => {
    if (window.confirm('Delete this address?')) run(() => apiClient.delete(`/users/addresses/${idOf(a)}`))
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-maroon">Saved Addresses</h2>

      {error && <p className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {addresses === null ? (
        <p className="mt-6 text-sm text-stone">Loading your addresses…</p>
      ) : (
        <>
          {addresses.length === 0 && !adding && (
            <p className="mt-6 text-sm text-stone">You haven&apos;t saved any delivery address yet.</p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {addresses.map((a) => (
              <div key={idOf(a)} className="border border-cream-dark p-5 text-sm">
                <p className="flex items-center gap-2 font-semibold text-maroon">
                  {a.name}
                  {a.isDefault && (
                    <span className="rounded-full bg-brown/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brown">
                      Default
                    </span>
                  )}
                </p>
                <p className="mt-1 text-brown/80">
                  {[a.addressLine1, a.addressLine2].filter(Boolean).join(', ')}
                </p>
                <p className="text-brown/80">
                  {a.city}, {a.state} - {a.postalCode}
                </p>
                <p className="mt-1 text-brown/80">{a.phone}</p>
                <div className="mt-3 flex gap-4 text-xs font-semibold uppercase tracking-wide">
                  {!a.isDefault && (
                    <button type="button" disabled={busy} onClick={() => makeDefault(a)} className="text-brown hover:underline">
                      Make default
                    </button>
                  )}
                  <button type="button" disabled={busy} onClick={() => remove(a)} className="text-red-700 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {adding ? (
            <form onSubmit={add} className="mt-6 grid gap-5 border border-cream-dark p-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-brown">Full name</span>
                <input value={form.name} onChange={update('name')} className={inputClass} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-brown">Mobile number</span>
                <input value={form.phone} onChange={update('phone')} inputMode="tel" className={inputClass} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-brown">Address line 1</span>
                <input value={form.addressLine1} onChange={update('addressLine1')} className={inputClass} />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-brown">Address line 2 (optional)</span>
                <input value={form.addressLine2} onChange={update('addressLine2')} className={inputClass} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-brown">City</span>
                <input value={form.city} onChange={update('city')} className={inputClass} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-brown">State</span>
                <input value={form.state} onChange={update('state')} className={inputClass} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-brown">PIN code</span>
                <input
                  value={form.postalCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, postalCode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  inputMode="numeric"
                  className={inputClass}
                />
              </label>
              <div className="flex items-end gap-3 sm:col-span-2">
                <Button type="submit" variant="primary" disabled={busy} className="disabled:opacity-60">
                  {busy ? 'Saving…' : 'Save address'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdding(false)
                    setError('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" className="mt-5" onClick={() => setAdding(true)}>
              Add New Address
            </Button>
          )}
        </>
      )}
    </div>
  )
}
