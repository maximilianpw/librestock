'use client'

import * as React from 'react'

interface FormErrorBannerProps {
  errors?: unknown[]
  className?: string
}

function formatFormError(error: unknown): string | null {
  if (error === null || error === undefined) return null
  if (typeof error === 'string') return error
  if (typeof error === 'number' || typeof error === 'boolean') {
    return String(error)
  }

  if (typeof error === 'object') {
    const maybe = error as Record<string, unknown>

    const form = maybe['form']
    if (typeof form === 'string' && form.length > 0) return form

    const message = maybe['message']
    if (typeof message === 'string' && message.length > 0) return message

    const zodErrors = maybe['_errors']
    if (
      Array.isArray(zodErrors) &&
      zodErrors.every((entry) => typeof entry === 'string')
    ) {
      const joined = zodErrors.join(', ')
      if (joined.length > 0) return joined
    }

    try {
      return JSON.stringify(error)
    } catch {
      return String(error)
    }
  }

  return String(error)
}

export function FormErrorBanner({
  errors,
  className,
}: FormErrorBannerProps): React.JSX.Element | null {
  if (!errors || errors.length === 0) return null

  const messages = errors
    .map(formatFormError)
    .filter((message): message is string => !!message && message.length > 0)

  if (messages.length === 0) return null

  return (
    <div
      className={[
        'bg-destructive/10 text-destructive mb-4 rounded-md p-3 text-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {messages.join(', ')}
    </div>
  )
}
