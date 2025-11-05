/**
 * API endpoint paths
 */

export const API_ENDPOINTS = {
  auth: {
    profile: '/auth/profile',
    session: '/auth/session',
  },
  users: {
    list: '/users',
    get: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    search: (query: string) => `/users/search?q=${query}`,
    activate: (id: string) => `/users/${id}/activate`,
    deactivate: (id: string) => `/users/${id}/deactivate`,
  },
  categories: {
    list: '/api/v1/categories',
    get: (id: string) => `/api/v1/categories/${id}`,
    create: '/api/v1/categories',
    update: (id: string) => `/api/v1/categories/${id}`,
    delete: (id: string) => `/api/v1/categories/${id}`,
  },
  products: {
    list: '/api/v1/products',
    get: (id: string) => `/api/v1/products/${id}`,
    getByCategory: (categoryId: string) => `/api/v1/products/category/${categoryId}`,
    getByCategoryTree: (categoryId: string) => `/api/v1/products/category/${categoryId}/tree`,
    create: '/api/v1/products',
    update: (id: string) => `/api/v1/products/${id}`,
    delete: (id: string) => `/api/v1/products/${id}`,
  },
} as const
