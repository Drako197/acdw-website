import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import 'react-day-picker/dist/style.css'
import './index.css'
import App from './App.tsx'

// Get Clerk publishable key from environment
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  console.warn('VITE_CLERK_PUBLISHABLE_KEY is not set. Authentication will not work.')
  console.warn('Please set VITE_CLERK_PUBLISHABLE_KEY in Netlify environment variables.')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {clerkPubKey ? (
      <ClerkProvider 
        publishableKey={clerkPubKey}
        // Safari-specific configuration
        // Ensure cookies work properly on Safari mobile
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        signInUrl="/auth/signin"
        signUpUrl="/auth/signup"
      >
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
