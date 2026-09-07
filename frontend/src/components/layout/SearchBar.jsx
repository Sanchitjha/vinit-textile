import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from '../icons/Icons'

// Cycled as an animated "typing" placeholder — real store categories, so it
// doubles as a hint of what's searchable.
const PLACEHOLDER_PHRASES = [
  'Search Sarees',
  'Search Silk Sarees',
  'Search Wedding Collection',
  'Search Bridal Sarees',
  'Search Festival Special',
]

export default function SearchBar({ onSubmitted, autoFocus = false }) {
  const [value, setValue] = useState('')
  const [placeholder, setPlaceholder] = useState('')
  const [showCursor, setShowCursor] = useState(true)
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

  // Blinking cursor effect for the typing animation
  useEffect(() => {
    if (value) return undefined
    const id = setInterval(() => setShowCursor((c) => !c), 530)
    return () => clearInterval(id)
  }, [value])

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  // ESC key closes search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onSubmitted?.()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSubmitted])

  const submit = (event) => {
    event.preventDefault()
    const q = value.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    onSubmitted?.()
  }

  return (
    <form onSubmit={submit} className="relative w-full">
      <div className="relative">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-ivory/60 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder=""
          aria-label="Search products"
          className="w-full rounded-full border border-ivory/30 bg-ivory/10 pl-14 pr-14 py-4 text-base text-ivory placeholder:text-ivory/50 backdrop-blur-sm outline-none transition-all duration-300 focus:border-gold/60 focus:bg-ivory/15 focus:shadow-[0_0_20px_rgba(201,151,46,0.15)]"
        />
        {/* Typing animation overlay — only shows when input is empty */}
        {!value && (
          <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 text-base text-ivory/50">
            {placeholder}
            <span
              className={`inline-block w-[2px] h-5 bg-gold ml-[1px] align-middle transition-opacity duration-100 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </span>
        )}
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-gold/20 text-ivory transition-all duration-300 hover:bg-gold hover:text-maroon"
        >
          <SearchIcon />
        </button>
      </div>
    </form>
  )
}
