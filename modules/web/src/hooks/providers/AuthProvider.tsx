'use client'

import { useAuth } from '@clerk/nextjs'
import { useRef } from 'react'
import { setTokenGetter } from '@/lib/data/axios-client'

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { getToken } = useAuth()
  const getTokenRef = useRef(getToken)
  getTokenRef.current = getToken

  // Register synchronously on first render using a ref
  // This ensures the token getter is available before any queries fire
  const initialized = useRef(false)
  if (!initialized.current) {
    initialized.current = true
    setTokenGetter(async () => {
      try {
        return await getTokenRef.current()
      } catch (error) {
        console.error('Failed to get Clerk token:', error)
        return null
      }
    })
  }

  return <>{children}</>
}
