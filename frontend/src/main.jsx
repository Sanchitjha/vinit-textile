import { ClerkProvider } from '@clerk/react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const PROXY_URL =
  import.meta.env.VITE_CLERK_PROXY_URL ||
  (typeof window !== 'undefined' ? `${window.location.origin}/__clerk` : undefined)

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const resolvedProxyUrl = PUBLISHABLE_KEY?.startsWith('pk_live_') ? PROXY_URL : undefined

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      proxyUrl={resolvedProxyUrl}
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