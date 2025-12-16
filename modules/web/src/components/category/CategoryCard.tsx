import { Folder, ChevronRight, ChevronDown } from 'lucide-react'
import type { CategoryResponseDto } from '@/lib/data/generated'

interface CategoryCardProps {
  category: CategoryResponseDto
  hasChildren: boolean
  isExpanded: boolean
  isSelected: boolean
  onToggle: () => void
  onClick: () => void
}

export function CategoryCard({
  category,
  hasChildren,
  isExpanded,
  isSelected,
  onToggle,
  onClick,
}: CategoryCardProps): React.JSX.Element {
  return (
    <div
      className={`group mb-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-all hover:bg-accent ${
        isSelected ? 'bg-accent' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {hasChildren ? (
        <button
          className="flex-shrink-0 rounded p-0.5 hover:bg-accent"
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
        >
          {isExpanded ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
        </button>
      ) : (
        <div className="w-5" />
      )}
      <Folder
        className={`size-4 shrink-0 ${
          isSelected ? 'text-primary' : 'text-muted-foreground'
        }`}
      />
      <span
        className={`truncate text-sm ${
          isSelected ? 'font-semibold text-foreground' : 'font-medium'
        }`}
      >
        {category.name}
      </span>
    </div>
  )
}
