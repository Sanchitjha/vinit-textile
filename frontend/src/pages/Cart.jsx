import { Link } from 'react-router-dom'
import Placeholder from '../components/ui/Placeholder'
import Button from '../components/ui/Button'
import { MinusIcon, PlusIcon } from '../components/icons/Icons'
import { toneFor } from '../data/products'
import { useCart } from '../context/CartContext'

const FREE_SHIPPING_THRESHOLD = 1999

export default function Cart() {
  const { items, subtotal, updateQty, removeFromCart } = useCart()

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <section className="container-ambika py-24 text-center">
        <h1 className="font-display text-3xl text-maroon">Your cart is empty</h1>
        <p className="mt-3 text-sm text-stone">Explore the collection and find something you love.</p>
        <Button to="/shop/saree" variant="primary" className="mt-6">
          Continue Shopping
        </Button>
      </section>
    )
  }

  return (
    <section className="container-ambika py-10">
      <h1 className="font-display text-4xl text-maroon">Shopping Cart</h1>

      <div className="mt-8 flex flex-col gap-10 lg:flex-row">
        <div className="flex-1 divide-y divide-cream-dark border-y border-cream-dark">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 py-6">
              <div className="w-20 shrink-0 sm:w-28">
                <Placeholder tone={toneFor(item.product.id)} ratio="aspect-[3/4]" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-sm font-medium text-maroon hover:text-brown"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-stone">Size: {item.size}</p>
                  </div>
                  <p className="text-sm font-semibold text-brown">
                    ₹{(item.product.price * item.qty).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-cream-dark">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center text-brown hover:bg-cream"
                    >
                      <MinusIcon width={14} height={14} />
                    </button>
                    <span className="w-8 text-center text-xs text-maroon">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center text-brown hover:bg-cream"
                    >
                      <PlusIcon width={14} height={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.key)}
                    className="text-xs font-medium text-stone hover:text-maroon hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="w-full shrink-0 self-start border border-cream-dark bg-ivory p-6 lg:w-80">
          <h2 className="font-display text-xl text-maroon">Order Summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone">Subtotal</dt>
              <dd className="text-brown">₹{subtotal.toLocaleString('en-IN')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone">Shipping</dt>
              <dd className="text-brown">{shipping === 0 ? 'Free' : `₹${shipping}`}</dd>
            </div>
            <div className="flex justify-between border-t border-cream-dark pt-3 text-base font-semibold">
              <dt className="text-maroon">Total</dt>
              <dd className="text-maroon">₹{total.toLocaleString('en-IN')}</dd>
            </div>
          </dl>
          <Button variant="primary" className="mt-6 w-full">
            Checkout
          </Button>
          <Link
            to="/shop/saree"
            className="mt-4 block text-center text-xs font-medium text-brown hover:underline"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  )
}
