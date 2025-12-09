/**
 * Shared types for RBI Inventory monorepo
 * These types are derived from the OpenAPI specification
 */

// User roles
export type UserRole = 'ADMIN' | 'WAREHOUSE_MANAGER' | 'PICKER' | 'SALES'

// Common response types
export interface ErrorResponse {
  error: string
}

export interface MessageResponse {
  message: string
}

// User types
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface CreateUserRequest {
  name: string
  email: string
  role: UserRole
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  is_active?: boolean
}

// Category types
export interface Category {
  id: string
  name: string
  description: string | null
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  parent_id?: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  parent_id?: string | null
}

// Product types
export interface Product {
  id: string
  name: string
  sku: string
  description: string | null
  category_id: string
  unit_price: number
  quantity_in_stock: number
  reorder_level: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateProductRequest {
  name: string
  sku: string
  description?: string
  category_id: string
  unit_price: number
  quantity_in_stock: number
  reorder_level: number
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  category_id?: string
  unit_price?: number
  reorder_level?: number
  is_active?: boolean
}

// Pagination
export interface PaginationMeta {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Health check
export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down'
  timestamp: string
  version?: string
}
