'use client'

import { useTranslation } from 'react-i18next'
import { FolderTree } from 'lucide-react'
import { AreaTreeItem } from './AreaTreeItem'
import { CreateArea } from './CreateArea'
import { Spinner } from '@/components/ui/spinner'
import { useAreasControllerFindAll } from '@/lib/data/generated'

interface AreaTreeProps {
  locationId: string
}

export function AreaTree({ locationId }: AreaTreeProps): React.JSX.Element {
  const { t } = useTranslation()

  const {
    data: areas,
    isLoading,
    error,
  } = useAreasControllerFindAll({
    location_id: locationId,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive py-8 text-center">
        {t('areas.errorLoading') || 'Error loading areas'}
      </div>
    )
  }

  // Filter root areas (no parent)
  const rootAreas = (areas ?? []).filter((area) => !area.parent_id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FolderTree className="size-5" />
          {t('areas.title') || 'Areas'}
        </h2>
        <CreateArea locationId={locationId} />
      </div>

      {rootAreas.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center border rounded-lg bg-muted/20">
          <FolderTree className="mx-auto size-12 opacity-40 mb-3" />
          <p>{t('areas.noAreas') || 'No areas found'}</p>
          <p className="text-sm mt-1">
            {t('areas.createDescription') || 'Add a new area within this location.'}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-2">
          {rootAreas.map((area) => (
            <AreaTreeItem
              key={area.id}
              allAreas={areas ?? []}
              area={area}
              locationId={locationId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
