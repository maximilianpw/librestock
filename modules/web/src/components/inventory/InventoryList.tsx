'use client'

import { useTranslation } from 'react-i18next'
import { InventoryCard } from './InventoryCard'
import { Spinner } from '@/components/ui/spinner'
import { useListInventory, type ListInventoryParams } from '@/lib/data/generated'

interface InventoryListProps {
  filters?: Partial<ListInventoryParams>
}

export function InventoryList({ filters }: InventoryListProps): React.JSX.Element {
  const { t } = useTranslation()

  const { data, isLoading, error } = useListInventory({
    page: 1,
    limit: 50,
    ...filters,
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
        {t('inventory.errorLoading') || 'Error loading inventory'}
      </div>
    )
  }

  const inventoryItems = data?.data ?? []

  if (inventoryItems.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        {t('inventory.noInventory') || 'No inventory found'}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {inventoryItems.map((inventory) => (
        <InventoryCard key={inventory.id} inventory={inventory} />
      ))}
    </div>
  )
}
