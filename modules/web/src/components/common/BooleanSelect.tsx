'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BooleanString } from '@/lib/enums/boolean-string.enum'

interface BooleanSelectProps {
  value: boolean
  onValueChange: (value: boolean) => void
  trueLabel: React.ReactNode
  falseLabel: React.ReactNode
  className?: string
  disabled?: boolean
}

export function BooleanSelect({
  value,
  onValueChange,
  trueLabel,
  falseLabel,
  className,
  disabled,
}: BooleanSelectProps): React.JSX.Element {
  const stringValue = value ? BooleanString.TRUE : BooleanString.FALSE
  return (
    <Select
      disabled={disabled}
      value={stringValue}
      onValueChange={(next) =>
        onValueChange(next === BooleanString.TRUE)
      }
    >
      <SelectTrigger className={className ?? 'w-full'}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={BooleanString.TRUE}>{trueLabel}</SelectItem>
        <SelectItem value={BooleanString.FALSE}>{falseLabel}</SelectItem>
      </SelectContent>
    </Select>
  )
}
