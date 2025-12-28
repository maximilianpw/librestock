import * as React from 'react'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

function parseExpiryDate(expiryDate: unknown): Date | null {
  if (typeof expiryDate === 'string' && expiryDate) {
    return new Date(expiryDate)
  }
  return null
}

interface ExpiryDateStatus {
  expiryDate: Date | null
  isExpired: boolean
  isExpiringSoon: boolean
}

export function useExpiryDateStatus(expiryDateRaw: unknown): ExpiryDateStatus {
  const expiryDate = React.useMemo(
    () => parseExpiryDate(expiryDateRaw),
    [expiryDateRaw]
  )

  const [currentTime] = React.useState(() => Date.now())

  const { isExpired, isExpiringSoon } = React.useMemo(() => {
    if (!expiryDate) {
      return { isExpired: false, isExpiringSoon: false }
    }
    const expiryTime = expiryDate.getTime()
    return {
      isExpired: expiryTime < currentTime,
      isExpiringSoon: expiryTime - currentTime < THIRTY_DAYS_MS && expiryTime > currentTime,
    }
  }, [expiryDate, currentTime])

  return { expiryDate, isExpired, isExpiringSoon }
}
