import { ClerkProvider } from '@clerk/react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
// Clerk talks to its Frontend API on clerk.vinittextiles.com (DNS is set up and verified). A proxy is
// opt-in only: a plain Vercel rewrite can't add the headers Clerk's proxy needs, so it answered 501
// to /v1/environment and /v1/client and the sign-in / sign-up forms did nothing.
const PROXY_URL = import.meta.env.VITE_CLERK_PROXY_URL || undefined

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      proxyUrl={PROXY_URL}
      afterSignOutUrl="/"
    >
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ClerkProvider>
  </StrictMode>,
)