import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'ambika-cart'

function loadInitialState() {
  if (typeof window === 'undefined') return { lines: {} }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? { lines: JSON.parse(saved) } : { lines: {} }
  } catch {
    return { lines: {} }
  }
}

function lineKey(productId, size) {
  return `${productId}__${size}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, size, qty } = action.payload
      const key = lineKey(product.id, size)
      const existing = state.lines[key]
      const nextQty = (existing?.qty ?? 0) + qty
      return {
        lines: {
          ...state.lines,
          [key]: { product, size, qty: nextQty },
        },
      }
    }
    case 'UPDATE_QTY': {
      const { key, qty } = action.payload
      if (qty < 1) {
        const { [key]: _removed, ...rest } = state.lines
        return { lines: rest }
      }
      return {
        lines: {
          ...state.lines,
          [key]: { ...state.lines[key], qty },
        },
      }
    }
    case 'REMOVE': {
      const { [action.payload.key]: _removed, ...rest } = state.lines
      return { lines: rest }
    }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines))
  }, [state.lines])

  const value = useMemo(() => {
    const items = Object.entries(state.lines).map(([key, line]) => ({ key, ...line }))
    const count = items.reduce((sum, item) => sum + item.qty, 0)
    const subtotal = items.reduce((sum, item) => sum + item.qty * item.product.price, 0)

    return {
      items,
      count,
      subtotal,
      addToCart: (product, size, qty = 1) => dispatch({ type: 'ADD', payload: { product, size, qty } }),
      updateQty: (key, qty) => dispatch({ type: 'UPDATE_QTY', payload: { key, qty } }),
      removeFromCart: (key) => dispatch({ type: 'REMOVE', payload: { key } }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
