import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { FolderNode } from '@/data/types/folder-node'
import type { SortOption } from '@/components/items/SortSelect'
import FolderSidebar from '@/components/common/FolderSidebar'
import { ItemCard } from '@/components/items/ItemCard'
import { sampleItems } from '@/data/routes/item'
import { sampleFolders } from '@/data/routes/folders'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import { SearchBar } from '@/components/items/SearchBar'
import { SortSelect } from '@/components/items/SortSelect'
import { DisplayTypeToggle } from '@/components/items/DisplayTypeToggle'
import { ItemsGrid } from '@/components/items/ItemsGrid'
import { ActionButtons } from '@/components/items/ActionButtons'
import {
  DisplayType,
  EmptyStateMessages,
  SortField,
  UIStrings,
} from '@/lib/enums'

export const Route = createFileRoute('/items')({
  component: ItemsPage,
})

const SORT_OPTIONS: Array<SortOption> = [
  { value: SortField.NAME, label: 'Name' },
  { value: SortField.QUANTITY, label: 'Quantity' },
  { value: SortField.ITEM_VALUE, label: 'Value' },
]

function findFolderPath(
  folders: Array<FolderNode>,
  targetId: string,
  currentPath: Array<FolderNode> = [],
): Array<FolderNode> | null {
  for (const folder of folders) {
    const newPath = [...currentPath, folder]
    if (folder.id === targetId) {
      return newPath
    }
    if (folder.children) {
      const result = findFolderPath(folder.children, targetId, newPath)
      if (result) return result
    }
  }
  return null
}

function ItemsPage() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState(SortField.NAME)
  const [displayType, setDisplayType] = useState<DisplayType>(DisplayType.GRID)

  const breadcrumbPath = selectedFolderId
    ? findFolderPath(sampleFolders, selectedFolderId) || []
    : []

  const filteredItems = sampleItems.filter(
    (item) =>
      (!selectedFolderId || item.folderId === selectedFolderId) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === SortField.NAME) return a.name.localeCompare(b.name)
    if (sortBy === SortField.QUANTITY) return b.quantity - a.quantity
    if (sortBy === SortField.ITEM_VALUE) return b.value - a.value
    return 0
  })

  return (
    <div className="page-container">
      <FolderSidebar
        folders={sampleFolders}
        selectedId={selectedFolderId}
        onSelect={setSelectedFolderId}
      />
      <div className="page-content">
        <div className="page-header">
          <div className="header-actions-row">
            <Breadcrumbs
              path={breadcrumbPath}
              setSelectedFolderId={setSelectedFolderId}
            />
            <ActionButtons className="action-group" />
          </div>

          <div className="filters-row">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={UIStrings.SEARCH_ITEMS_PLACEHOLDER}
            />
            <SortSelect
              value={sortBy}
              onChange={(value) => setSortBy(value as SortField)}
              options={SORT_OPTIONS}
            />
            <DisplayTypeToggle value={displayType} onChange={setDisplayType} />
          </div>
        </div>

        <div className="content-section">
          <ItemsGrid
            items={sortedItems}
            displayType={displayType}
            renderItem={(item) => (
              <ItemCard key={item.id} item={item} displayType={displayType} />
            )}
            emptyMessage={EmptyStateMessages.NO_ITEMS_FOLDER}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  )
}
