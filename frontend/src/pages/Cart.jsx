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
        <h1 className="font-display text-4xl text-brown">Your cart is empty</h1>
        <p className="mt-4 text-sm text-brown-light">Explore the collection and find something you love.</p>
        <Button to="/shop/saree" variant="primary" className="mt-8">
          Continue Shopping
        </Button>
      </section>
    )
  }

  return (
    <section className="container-ambika py-16">
      <h1 className="font-display text-5xl text-brown">Shopping Cart</h1>

      <div className="mt-12 flex flex-col gap-12 lg:flex-row">
        <div className="flex-1 divide-y divide-brown/10 border-y border-brown/10">
          {items.map((item) => (
            <div key={item.key} className="flex gap-6 py-8">
              <div className="w-24 shrink-0 sm:w-32 bg-cream">
                <Placeholder tone={toneFor(item.product.id)} ratio="aspect-[4/5]" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      to={`/product/${item.product.id}`}
                      className="text-sm font-medium text-brown hover:text-brown-light transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-2 text-[11px] uppercase tracking-widest text-brown-light">Size: {item.size}</p>
                  </div>
                  <p className="text-sm font-medium text-brown">
                    ₹{(item.product.price * item.qty).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-brown/20 bg-transparent">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      className="flex h-10 w-10 items-center justify-center text-brown hover:bg-cream transition-colors"
                    >
                      <MinusIcon width={14} height={14} />
                    </button>
                    <span className="w-8 text-center text-[13px] font-medium text-brown">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      className="flex h-10 w-10 items-center justify-center text-brown hover:bg-cream transition-colors"
                    >
                      <PlusIcon width={14} height={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.key)}
                    className="text-[10px] uppercase tracking-widest font-medium text-brown-light hover:text-brown transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="w-full shrink-0 self-start border border-brown/10 bg-cream p-8 lg:w-96">
          <h2 className="font-display text-2xl text-brown">Order Summary</h2>
          <dl className="mt-6 space-y-4 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-brown-light">Subtotal</dt>
              <dd className="text-brown font-medium">₹{subtotal.toLocaleString('en-IN')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brown-light">Shipping</dt>
              <dd className="text-brown font-medium">{shipping === 0 ? 'Free' : `₹${shipping}`}</dd>
            </div>
            <div className="flex justify-between border-t border-brown/10 pt-4 text-base font-medium">
              <dt className="text-brown">Total</dt>
              <dd className="text-brown">₹{total.toLocaleString('en-IN')}</dd>
            </div>
          </dl>
          <Button variant="primary" className="mt-8 w-full">
            Checkout
          </Button>
          <Link
            to="/shop/saree"
            className="mt-6 block text-center text-[10px] uppercase tracking-widest font-medium text-brown hover:text-brown-light transition-colors"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  )
}
