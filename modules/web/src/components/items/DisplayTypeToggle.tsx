import clsx from 'clsx'
import { Grid, List } from 'lucide-react'
import { DisplayType } from '@/lib/enums'

interface DisplayTypeToggleProps {
  value: DisplayType
  onChange: (value: DisplayType) => void
  className?: string
}

export function DisplayTypeToggle({
  value,
  onChange,
  className = '',
}: DisplayTypeToggleProps) {
  return (
    <div
      className={`flex border border-gray-300 rounded-md overflow-hidden ${className}`}
    >
      <button
        onClick={() => onChange(DisplayType.GRID)}
        className={clsx(
          'p-2 hover:bg-gray-100',
          value === DisplayType.GRID && 'bg-gray-100',
        )}
        aria-label="Grid view"
      >
        <Grid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange(DisplayType.LIST)}
        className={clsx(
          'p-2 hover:bg-gray-100',
          value === DisplayType.LIST && 'bg-gray-100',
        )}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  )
}
