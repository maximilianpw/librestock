import clsx from 'clsx'
import { Grid, List } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { DisplayType } from '@/lib/enums/display-type.enum'

interface DisplayTypeToggleProps {
  value: DisplayType
  onChange: (value: DisplayType) => void
  className?: string
}

export function DisplayTypeToggle({
  value,
  onChange,
  className = '',
}: DisplayTypeToggleProps): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <div
      className={`flex overflow-hidden rounded-md border border-border ${className}`}
    >
      <button
        aria-label={t('view.grid')}
        className={clsx(
          'p-2 hover:bg-accent',
          value === DisplayType.GRID && 'bg-accent',
        )}
        onClick={() => onChange(DisplayType.GRID)}
      >
        <Grid className="h-4 w-4" />
      </button>
      <button
        aria-label={t('view.list')}
        className={clsx(
          'p-2 hover:bg-accent',
          value === DisplayType.LIST && 'bg-accent',
        )}
        onClick={() => onChange(DisplayType.LIST)}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  )
}
