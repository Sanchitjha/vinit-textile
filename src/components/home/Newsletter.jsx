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
    <section className="bg-cream-dark/60">
      <div className="container-ambika flex flex-col items-center gap-5 py-16 text-center">
        <h2 className="font-display text-3xl text-maroon">Be The First To Know</h2>
        <p className="max-w-sm text-sm text-brown/80">
          Join the club &amp; get exclusive access to new arrivals, festive edits and members-only
          offers.
        </p>

        {submitted ? (
          <p className="text-sm font-medium text-brown">
            Thank you — you&apos;re on the list, {email}.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full border border-brown/30 bg-ivory px-4 py-3 text-sm text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
            />
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
