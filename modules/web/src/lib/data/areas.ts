import type {
  AreaQueryDto,
  AreaResponseDto,
  CreateAreaDto,
  UpdateAreaDto,
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

export type { AreaQueryDto, AreaResponseDto, CreateAreaDto, UpdateAreaDto }

export const getAreasControllerFindAllQueryKey = (params?: AreaQueryDto) => {
  return ['/areas', ...(params ? [params] : [])] as const
}

export const getAreasControllerFindByIdQueryKey = (id?: string) => {
  return ['/areas', id] as const
}

const listAreas = async (params?: AreaQueryDto, signal?: AbortSignal) => {
  return await getAxiosInstance<AreaResponseDto[]>({
    url: '/areas',
    method: 'GET',
    params,
    signal,
  })
}

const getArea = async (id: string, signal?: AbortSignal) => {
  return await getAxiosInstance<AreaResponseDto>({
    url: `/areas/${id}`,
    method: 'GET',
    signal,
  })
}

const createArea = async (data: CreateAreaDto) => {
  return await getAxiosInstance<AreaResponseDto>({
    url: '/areas',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

const updateArea = async (id: string, data: UpdateAreaDto) => {
  return await getAxiosInstance<AreaResponseDto>({
    url: `/areas/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

const deleteArea = async (id: string) => {
  return await getAxiosInstance<void>({
    url: `/areas/${id}`,
    method: 'DELETE',
  })
}

export function getAreasControllerFindAllQueryOptions(
  params?: AreaQueryDto,
  options?: { query?: Partial<UseQueryOptions<AreaResponseDto[]>> },
) {
  const queryKey =
    options?.query?.queryKey ?? getAreasControllerFindAllQueryKey(params)
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await listAreas(params, signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    AreaResponseDto[],
    unknown,
    AreaResponseDto[],
    QueryKey
  >
}

export function getAreasControllerFindByIdQueryOptions(
  id?: string,
  options?: { query?: Partial<UseQueryOptions<AreaResponseDto>> },
): UseQueryOptions<AreaResponseDto, unknown, AreaResponseDto, QueryKey> {
  if (!id) {
    return {
      queryKey: getAreasControllerFindByIdQueryKey(id),
      queryFn: async () =>
        await Promise.reject(new Error('Area id is required to fetch an area')),
      enabled: false,
    } as UseQueryOptions<AreaResponseDto, unknown, AreaResponseDto, QueryKey>
  }
  const queryKey =
    options?.query?.queryKey ?? getAreasControllerFindByIdQueryKey(id)
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await getArea(id, signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    AreaResponseDto,
    unknown,
    AreaResponseDto,
    QueryKey
  >
}

export function useAreasControllerFindAll(
  params?: AreaQueryDto,
  options?: { query?: Partial<UseQueryOptions<AreaResponseDto[]>> },
  queryClient?: QueryClient,
): UseQueryResult<AreaResponseDto[]> & { queryKey: QueryKey } {
  const queryOptions = getAreasControllerFindAllQueryOptions(params, options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    AreaResponseDto[]
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useAreasControllerFindById(
  id: string,
  options?: { query?: Partial<UseQueryOptions<AreaResponseDto>> },
  queryClient?: QueryClient,
): UseQueryResult<AreaResponseDto> & { queryKey: QueryKey } {
  const queryOptions = getAreasControllerFindByIdQueryOptions(id, options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    AreaResponseDto
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useAreasControllerCreate(
  options?: {
    mutation?: UseMutationOptions<AreaResponseDto, unknown, { data: CreateAreaDto }>
  },
  queryClient?: QueryClient,
): UseMutationResult<AreaResponseDto, unknown, { data: CreateAreaDto }> {
  return useMutation(
    {
      mutationKey: ['areasControllerCreate'],
      mutationFn: async (vars) => await createArea(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useAreasControllerUpdate(
  options?: {
    mutation?: UseMutationOptions<
      AreaResponseDto,
      unknown,
      { id: string; data: UpdateAreaDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  AreaResponseDto,
  unknown,
  { id: string; data: UpdateAreaDto }
> {
  return useMutation(
    {
      mutationKey: ['areasControllerUpdate'],
      mutationFn: async (vars) => await updateArea(vars.id, vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useAreasControllerDelete(
  options?: {
    mutation?: UseMutationOptions<void, unknown, { id: string }>
  },
  queryClient?: QueryClient,
): UseMutationResult<void, unknown, { id: string }> {
  return useMutation(
    {
      mutationKey: ['areasControllerDelete'],
      mutationFn: async (vars) => await deleteArea(vars.id),
      ...options?.mutation,
    },
    queryClient,
  )
}
