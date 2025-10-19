import { Select } from '../ui/select'

export interface SortOption {
  value: string
  label: string
}

interface SortSelectProps {
  value: string
  onChange: (value: string) => void
  options: Array<SortOption>
  className?: string
}

export function SortSelect({
  value,
  onChange,
  options,
  className = 'w-40',
}: SortSelectProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  )
}
