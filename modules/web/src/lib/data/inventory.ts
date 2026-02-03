import type {
  AdjustInventoryDto,
  CreateInventoryDto,
  InventoryQueryDto,
  InventoryResponseDto,
  PaginatedInventoryResponseDto,
  UpdateInventoryDto,
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
  AdjustInventoryDto,
  CreateInventoryDto,
  InventoryQueryDto,
  InventoryResponseDto,
  PaginatedInventoryResponseDto,
  UpdateInventoryDto,
}

const INVENTORY_ENDPOINT = '/inventory'

export const getListInventoryQueryKey = (params?: InventoryQueryDto) => {
  return [INVENTORY_ENDPOINT, ...(params ? [params] : [])] as const
}

const JSON_CONTENT_TYPE = 'application/json'

const listInventory = async (
  params?: InventoryQueryDto,
  signal?: AbortSignal,
) => {
  return await getAxiosInstance<PaginatedInventoryResponseDto>({
    url: INVENTORY_ENDPOINT,
    method: 'GET',
    params,
    signal,
  })
}

const createInventoryItem = async (data: CreateInventoryDto) => {
  return await getAxiosInstance<InventoryResponseDto>({
    url: INVENTORY_ENDPOINT,
    method: 'POST',
    headers: { 'Content-Type': JSON_CONTENT_TYPE },
    data,
  })
}

const updateInventoryItem = async (id: string, data: UpdateInventoryDto) => {
  return await getAxiosInstance<InventoryResponseDto>({
    url: `/inventory/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': JSON_CONTENT_TYPE },
    data,
  })
}

const deleteInventoryItem = async (id: string) => {
  return await getAxiosInstance<void>({
    url: `/inventory/${id}`,
    method: 'DELETE',
  })
}

const adjustInventoryQuantity = async (id: string, data: AdjustInventoryDto) => {
  return await getAxiosInstance<InventoryResponseDto>({
    url: `/inventory/${id}/adjust`,
    method: 'PATCH',
    headers: { 'Content-Type': JSON_CONTENT_TYPE },
    data,
  })
}

export function getListInventoryQueryOptions(
  params?: InventoryQueryDto,
  options?: { query?: Partial<UseQueryOptions<PaginatedInventoryResponseDto>> },
) {
  const queryKey = options?.query?.queryKey ?? getListInventoryQueryKey(params)
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await listInventory(params, signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    PaginatedInventoryResponseDto,
    unknown,
    PaginatedInventoryResponseDto,
    QueryKey
  >
}

export function useListInventory(
  params?: InventoryQueryDto,
  options?: { query?: Partial<UseQueryOptions<PaginatedInventoryResponseDto>> },
  queryClient?: QueryClient,
): UseQueryResult<PaginatedInventoryResponseDto> & { queryKey: QueryKey } {
  const queryOptions = getListInventoryQueryOptions(params, options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    PaginatedInventoryResponseDto
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useCreateInventoryItem(
  options?: {
    mutation?: UseMutationOptions<
      InventoryResponseDto,
      unknown,
      { data: CreateInventoryDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  InventoryResponseDto,
  unknown,
  { data: CreateInventoryDto }
> {
  return useMutation(
    {
      mutationKey: ['createInventoryItem'],
      mutationFn: async (vars) => await createInventoryItem(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useUpdateInventoryItem(
  options?: {
    mutation?: UseMutationOptions<
      InventoryResponseDto,
      unknown,
      { id: string; data: UpdateInventoryDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  InventoryResponseDto,
  unknown,
  { id: string; data: UpdateInventoryDto }
> {
  return useMutation(
    {
      mutationKey: ['updateInventoryItem'],
      mutationFn: async (vars) => await updateInventoryItem(vars.id, vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useDeleteInventoryItem(
  options?: {
    mutation?: UseMutationOptions<void, unknown, { id: string }>
  },
  queryClient?: QueryClient,
): UseMutationResult<void, unknown, { id: string }> {
  return useMutation(
    {
      mutationKey: ['deleteInventoryItem'],
      mutationFn: async (vars) => await deleteInventoryItem(vars.id),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useAdjustInventoryQuantity(
  options?: {
    mutation?: UseMutationOptions<
      InventoryResponseDto,
      unknown,
      { id: string; data: AdjustInventoryDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  InventoryResponseDto,
  unknown,
  { id: string; data: AdjustInventoryDto }
> {
  return useMutation(
    {
      mutationKey: ['adjustInventoryQuantity'],
      mutationFn: async (vars) =>
        await adjustInventoryQuantity(vars.id, vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}
