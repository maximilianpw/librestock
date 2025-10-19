import * as React from 'react'
import { Package } from './items'
import type {Item} from '@/data/routes/item';
import type { DisplayType} from './items';

export function ItemCard({
  item,
  displayType,
}: {
  item: Item
  displayType: DisplayType
}) {
  if (displayType === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-4">
        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span>Qty: {item.quantity}</span>
            <span>Total: ${(item.value * item.quantity).toLocaleString()}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Package className="h-16 w-16" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate mb-2">{item.name}</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Quantity: {item.quantity}</p>
          <p className="font-medium text-gray-900">
            Total: ${(item.value * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
