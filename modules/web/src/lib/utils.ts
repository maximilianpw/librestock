import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { ClassValue } from 'clsx'
import type { CategoryWithChildrenResponseDto } from './data/categories'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function isValidCategoryId(
  categories: CategoryWithChildrenResponseDto[],
  categoryId: string,
): boolean {
  if (categoryId === '') return false
  const stack: CategoryWithChildrenResponseDto[] = [...categories]

  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) continue
    if (current.id === categoryId) return true
    if (current.children.length > 0) {
      stack.push(...current.children)
    }
  }

  return false
}
