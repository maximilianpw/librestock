import { FolderPlus, Plus } from 'lucide-react'
import { Button } from '../ui/button'

interface ActionButtonsProps {
  onAddItem?: () => void
  onAddFolder?: () => void
  className?: string
}

export function ActionButtons({
  onAddItem,
  onAddFolder,
  className = '',
}: ActionButtonsProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {onAddItem && (
        <Button variant={'outline'} className="gap-2" onClick={onAddItem}>
          <Plus className="h-4 w-4" />
          Add New Item
        </Button>
      )}
      {onAddFolder && (
        <Button variant={'outline'} className="gap-2" onClick={onAddFolder}>
          <FolderPlus className="h-4 w-4" />
          Add New Folder
        </Button>
      )}
    </div>
  )
}
