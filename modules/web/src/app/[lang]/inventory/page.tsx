'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, AlertTriangle, Clock } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'
import { CreateInventory } from '@/components/inventory/CreateInventory'
import { InventoryList } from '@/components/inventory/InventoryList'
import {
  useListAllProducts,
  useListAllLocations,
} from '@/lib/data/generated'

export default function InventoryPage(): React.JSX.Element {
  const { t } = useTranslation()
  const [productFilter, setProductFilter] = React.useState<string>('ALL')
  const [locationFilter, setLocationFilter] = React.useState<string>('ALL')
  const [showLowStock, setShowLowStock] = React.useState(false)
  const [showExpiringSoon, setShowExpiringSoon] = React.useState(false)

  const { data: products } = useListAllProducts()
  const { data: locations } = useListAllLocations()

  // Build filters for InventoryList
  const filters = React.useMemo(() => {
    const f: Record<string, string | boolean> = {}
    if (productFilter !== 'ALL') {
      f.product_id = productFilter
    }
    if (locationFilter !== 'ALL') {
      f.location_id = locationFilter
    }
    if (showLowStock) {
      f.low_stock = true
    }
    if (showExpiringSoon) {
      f.expiring_soon = true
    }
    return f
  }, [productFilter, locationFilter, showLowStock, showExpiringSoon])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {t('navigation.inventory') || 'Inventory'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t('inventory.subtitle') || 'Track product quantities across locations'}
            </p>
          </div>
          <CreateInventory />
        </div>
      </div>

      <div className="border-b px-6 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder={t('inventory.filterByProduct') || 'Filter by product'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                {t('inventory.allProducts') || 'All Products'}
              </SelectItem>
              {(products ?? []).map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder={t('inventory.filterByLocation') || 'Filter by location'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                {t('inventory.allLocations') || 'All Locations'}
              </SelectItem>
              {(locations ?? []).map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Toggle
            aria-label="Show low stock"
            pressed={showLowStock}
            onPressedChange={setShowLowStock}
          >
            <AlertTriangle className="mr-2 size-4" />
            {t('inventory.lowStock') || 'Low Stock'}
          </Toggle>

          <Toggle
            aria-label="Show expiring soon"
            pressed={showExpiringSoon}
            onPressedChange={setShowExpiringSoon}
          >
            <Clock className="mr-2 size-4" />
            {t('inventory.expiringSoon') || 'Expiring Soon'}
          </Toggle>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <InventoryList filters={filters} />
      </div>
    </div>
  )
}
