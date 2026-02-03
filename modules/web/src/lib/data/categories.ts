import type {
  CategoryResponseDto,
  CategoryWithChildrenResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@librestock/types'
import {
  type QueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { getAxiosInstance } from './axios-client'

export type {
  CategoryResponseDto,
  CategoryWithChildrenResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
}

const CATEGORIES_ENDPOINT = '/categories'

export const getListCategoriesQueryKey = () => [CATEGORIES_ENDPOINT] as const

const JSON_CONTENT_TYPE = 'application/json'

const listCategories = async (signal?: AbortSignal) => {
  return await getAxiosInstance<CategoryWithChildrenResponseDto[]>({
    url: CATEGORIES_ENDPOINT,
    method: 'GET',
    signal,
  })
}

const createCategory = async (data: CreateCategoryDto) => {
  return await getAxiosInstance<CategoryResponseDto>({
    url: CATEGORIES_ENDPOINT,
    method: 'POST',
    headers: { 'Content-Type': JSON_CONTENT_TYPE },
    data,
  })
}

const updateCategory = async (id: string, data: UpdateCategoryDto) => {
  return await getAxiosInstance<CategoryResponseDto>({
    url: `/categories/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': JSON_CONTENT_TYPE },
    data,
  })
}

const deleteCategory = async (id: string) => {
  return await getAxiosInstance<void>({
    url: `/categories/${id}`,
    method: 'DELETE',
  })
}

export function getListCategoriesQueryOptions(
  options?: { query?: Partial<UseQueryOptions<CategoryWithChildrenResponseDto[]>> },
) {
  const queryKey = options?.query?.queryKey ?? getListCategoriesQueryKey()
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await listCategories(signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    CategoryWithChildrenResponseDto[],
    unknown,
    CategoryWithChildrenResponseDto[],
    QueryKey
  >
}

export function useListCategories(
  options?: { query?: Partial<UseQueryOptions<CategoryWithChildrenResponseDto[]>> },
  queryClient?: QueryClient,
): UseQueryResult<CategoryWithChildrenResponseDto[]> & { queryKey: QueryKey } {
  const queryOptions = getListCategoriesQueryOptions(options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    CategoryWithChildrenResponseDto[]
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useCreateCategory(
  options?: {
    mutation?: UseMutationOptions<
      CategoryResponseDto,
      unknown,
      { data: CreateCategoryDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  CategoryResponseDto,
  unknown,
  { data: CreateCategoryDto }
> {
  return useMutation(
    {
      mutationKey: ['createCategory'],
      mutationFn: async (vars) => await createCategory(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useUpdateCategory(
  options?: {
    mutation?: UseMutationOptions<
      CategoryResponseDto,
      unknown,
      { id: string; data: UpdateCategoryDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  CategoryResponseDto,
  unknown,
  { id: string; data: UpdateCategoryDto }
> {
  return useMutation(
    {
      mutationKey: ['updateCategory'],
      mutationFn: async (vars) => await updateCategory(vars.id, vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useDeleteCategory(
  options?: {
    mutation?: UseMutationOptions<void, unknown, { id: string }>
  },
  queryClient?: QueryClient,
): UseMutationResult<void, unknown, { id: string }> {
  return useMutation(
    {
      mutationKey: ['deleteCategory'],
      mutationFn: async (vars) => await deleteCategory(vars.id),
      ...options?.mutation,
    },
    queryClient,
  )
}
