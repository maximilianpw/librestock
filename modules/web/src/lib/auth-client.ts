import { createAuthClient } from 'better-auth/react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const authBaseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '')

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
})

export const { useSession, signIn, signOut, signUp } = authClient
