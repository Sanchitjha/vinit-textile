import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from '../icons/Icons'

// Cycled as an animated "typing" placeholder — real store categories, so it
// doubles as a hint of what's searchable.
const PLACEHOLDER_PHRASES = [
  'Search Sarees',
  'Search Silk Sarees',
  'Search Lehengas',
  'Search Wedding Collection',
  'Search Kurtis',
]

export default function SearchBar({ onSubmitted, autoFocus = false }) {
  const [value, setValue] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // Typewriter effect: types out each phrase, pauses, deletes, moves to the
  // next. Only runs while the field is empty so it never fights with what the
  // shopper is actually typing.
  useEffect(() => {
    if (value) return undefined
    let phraseIndex = 0
    let charIndex = 0
    let deleting = false
    let timeoutId

    const tick = () => {
      const phrase = PLACEHOLDER_PHRASES[phraseIndex]
      if (!deleting) {
        charIndex += 1
        setPlaceholder(phrase.slice(0, charIndex))
        if (charIndex === phrase.length) {
          deleting = true
          timeoutId = setTimeout(tick, 1400)
          return
        }
        timeoutId = setTimeout(tick, 70)
      } else {
        charIndex -= 1
        setPlaceholder(phrase.slice(0, charIndex))
        if (charIndex === 0) {
          deleting = false
          phraseIndex = (phraseIndex + 1) % PLACEHOLDER_PHRASES.length
          timeoutId = setTimeout(tick, 400)
          return
        }
        timeoutId = setTimeout(tick, 35)
      }
    }

    timeoutId = setTimeout(tick, 300)
    return () => clearTimeout(timeoutId)
  }, [value])

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const submit = (event) => {
    event.preventDefault()
    const q = value.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    onSubmitted?.()
  }

  return (
    <form onSubmit={submit} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className="w-full rounded-full border border-ivory/50 bg-ivory/10 px-5 py-3 pr-12 text-sm text-ivory placeholder:text-ivory/75 backdrop-blur-sm outline-none transition-colors focus:border-ivory focus:bg-ivory/20"
      />
      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ivory transition-colors hover:text-gold"
      >
        <SearchIcon />
      </button>
    </form>
  )
}
