import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <section className="container-ambika flex flex-col items-center justify-center gap-4 py-32 text-center">
      <p className="font-display text-6xl text-maroon">404</p>
      <h1 className="font-display text-2xl text-maroon">Page Not Found</h1>
      <p className="max-w-sm text-sm text-stone">
        The page you&apos;re looking for may have been moved or no longer exists.
      </p>
      <Button to="/" variant="primary" className="mt-2">
        Back to Home
      </Button>
    </section>
  )
}
