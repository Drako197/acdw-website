import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import 'react-day-picker/dist/style.css'
import './index.css'
import App from './App.tsx'

// Get Clerk publishable key from environment
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  console.error('VITE_CLERK_PUBLISHABLE_KEY is not set. Authentication will not work.')
  // Still render with ClerkProvider to prevent errors, but auth won't work
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey || 'pk_test_placeholder'}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
