import { clerkMiddleware } from '@clerk/tanstack-react-start/server'
import { createStart } from '@tanstack/react-start'
import { sentryMiddleware } from './app/global-middleware'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [clerkMiddleware(), sentryMiddleware],
  }
})
