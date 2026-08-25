import { useState } from 'react'
import Button from '../components/ui/Button'
import { MailIcon } from '../components/icons/Icons'

export default function Contact() {
  const [sent, setSent] = useState(false)

  return (
    <section className="container-ambika py-10">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-olive">Get In Touch</p>
        <h1 className="font-display mt-3 text-4xl text-maroon">Contact Us</h1>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-10 sm:grid-cols-2">
        <div className="space-y-4 text-sm text-brown/80">
          <p className="flex items-center gap-2">
            <MailIcon width={16} height={16} /> hello@ambika.com
          </p>
          <p>+91 98765 43210</p>
          <p>123 Heritage Lane, Ahmedabad, Gujarat, India</p>
        </div>

        {sent ? (
          <p className="text-sm font-medium text-brown">
            Thanks for reaching out — we&apos;ll get back to you shortly.
          </p>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setSent(true)
            }}
            className="space-y-4"
          >
            <input
              required
              placeholder="Your name"
              className="w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
            />
            <input
              required
              type="email"
              placeholder="Your email"
              className="w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
            />
            <textarea
              required
              rows={4}
              placeholder="Your message"
              className="w-full border border-brown/30 bg-transparent px-4 py-3 text-sm text-maroon placeholder:text-stone focus:border-brown focus:outline-none"
            />
            <Button type="submit" variant="primary" className="w-full">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
