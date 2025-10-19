import { Package } from 'lucide-react'
import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface ImagePlaceholderProps {
  icon?: LucideIcon
  iconSize?: 'sm' | 'md' | 'lg'
  className?: string
}

const iconSizes = {
  ['sm']: 'h-8 w-8',
  ['md']: 'h-12 w-12',
  ['lg']: 'h-16 w-16',
}

export function ImagePlaceholder({
  icon: Icon = Package,
  iconSize = 'md',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={clsx(
        'w-full h-full flex items-center justify-center text-gray-400',
        className,
      )}
    >
      <Icon className={iconSizes[iconSize]} />
    </div>
  )
}
