import { Inbox } from 'lucide-react'
import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  message: string
  description?: string
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  message,
  description,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={clsx('empty-state flex-col', className)}>
      <Icon className="h-12 w-12 text-gray-400 mb-3" />
      <p className="text-gray-500 font-medium">{message}</p>
      {description && (
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      )}
    </div>
  )
}
