import { useState } from 'react'
import Button from '../ui/Button'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="bg-cream">
      <div className="container-ambika flex flex-col items-center gap-6 py-10 text-center">
        <h2 className="font-display text-4xl text-brown">Be The First To Know</h2>
        <p className="max-w-sm text-sm text-brown-light">
          Join the club &amp; get exclusive access to new arrivals, festive edits and members-only
          offers.
        </p>

        {submitted ? (
          <p className="text-sm font-medium text-brown">
            Thank you — you&apos;re on the list, {email}.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-0 sm:flex-row mt-4">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ENTER YOUR EMAIL"
              className="w-full border border-brown/20 bg-transparent px-5 py-3 text-[11px] uppercase tracking-widest text-brown placeholder:text-brown-light focus:border-brown focus:outline-none"
            />
            <Button type="submit" variant="primary" className="w-full sm:w-auto shrink-0">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
