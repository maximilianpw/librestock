import clsx from 'clsx'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

interface CardImageProps {
  src?: string
  alt: string
  aspectRatio?: 'square' | 'video' | 'auto'
  className?: string
  placeholder?: ReactNode
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={clsx('p-4', className)}>{children}</div>
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={clsx('p-4', className)}>{children}</div>
}

export function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-gray-200 rounded-lg',
        hoverable && 'hover:shadow-md transition-shadow cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardImage({
  src,
  alt,
  aspectRatio = 'auto',
  className = '',
  placeholder,
}: CardImageProps) {
  const aspectClasses = {
    ['square']: 'aspect-square',
    ['video']: 'aspect-video',
    ['auto']: '',
  }

  return (
    <div
      className={clsx(
        'bg-gray-100 overflow-hidden',
        aspectClasses[aspectRatio],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        placeholder || <div className="w-full h-full bg-gray-100" />
      )}
    </div>
  )
}
