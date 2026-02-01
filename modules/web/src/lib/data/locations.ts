import {
  LocationSortField,
  LocationType,
  SortOrder,
  type CreateLocationDto,
  type LocationQueryDto,
  type LocationResponseDto,
  type PaginatedLocationsResponseDto,
  type UpdateLocationDto,
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
  CreateLocationDto,
  LocationQueryDto,
  LocationResponseDto,
  PaginatedLocationsResponseDto,
  UpdateLocationDto,
}
export { LocationSortField, LocationType, SortOrder }

const LOCATIONS_ENDPOINT = '/locations'

export const getListLocationsQueryKey = (params?: LocationQueryDto) => {
  return [LOCATIONS_ENDPOINT, ...(params ? [params] : [])] as const
}

export const getListAllLocationsQueryKey = () => ['/locations/all'] as const

const JSON_CONTENT_TYPE = 'application/json'

const listLocations = async (
  params?: LocationQueryDto,
  signal?: AbortSignal,
) => {
  return await getAxiosInstance<PaginatedLocationsResponseDto>({
    url: LOCATIONS_ENDPOINT,
    method: 'GET',
    params,
    signal,
  })
}

const listAllLocations = async (signal?: AbortSignal) => {
  return await getAxiosInstance<LocationResponseDto[]>({
    url: '/locations/all',
    method: 'GET',
    signal,
  })
}

const getLocation = async (id: string, signal?: AbortSignal) => {
  return await getAxiosInstance<LocationResponseDto>({
    url: `/locations/${id}`,
    method: 'GET',
    signal,
  })
}

const createLocation = async (data: CreateLocationDto) => {
  return await getAxiosInstance<LocationResponseDto>({
    url: LOCATIONS_ENDPOINT,
    method: 'POST',
    headers: { 'Content-Type': JSON_CONTENT_TYPE },
    data,
  })
}

const updateLocation = async (id: string, data: UpdateLocationDto) => {
  return await getAxiosInstance<LocationResponseDto>({
    url: `/locations/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': JSON_CONTENT_TYPE },
    data,
  })
}

const deleteLocation = async (id: string) => {
  return await getAxiosInstance<void>({
    url: `/locations/${id}`,
    method: 'DELETE',
  })
}

export function getListLocationsQueryOptions(
  params?: LocationQueryDto,
  options?: { query?: Partial<UseQueryOptions<PaginatedLocationsResponseDto>> },
) {
  const queryKey = options?.query?.queryKey ?? getListLocationsQueryKey(params)
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await listLocations(params, signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    PaginatedLocationsResponseDto,
    unknown,
    PaginatedLocationsResponseDto,
    QueryKey
  >
}

export function getListAllLocationsQueryOptions(
  options?: { query?: Partial<UseQueryOptions<LocationResponseDto[]>> },
) {
  const queryKey = options?.query?.queryKey ?? getListAllLocationsQueryKey()
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await listAllLocations(signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    LocationResponseDto[],
    unknown,
    LocationResponseDto[],
    QueryKey
  >
}

export function getGetLocationQueryOptions(
  id: string,
  options?: { query?: Partial<UseQueryOptions<LocationResponseDto>> },
) {
  const queryKey = options?.query?.queryKey ?? [`/locations/${id}`]
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await getLocation(id, signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    LocationResponseDto,
    unknown,
    LocationResponseDto,
    QueryKey
  >
}

export function useListLocations(
  params?: LocationQueryDto,
  options?: { query?: Partial<UseQueryOptions<PaginatedLocationsResponseDto>> },
  queryClient?: QueryClient,
): UseQueryResult<PaginatedLocationsResponseDto> & { queryKey: QueryKey } {
  const queryOptions = getListLocationsQueryOptions(params, options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    PaginatedLocationsResponseDto
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useListAllLocations(
  options?: { query?: Partial<UseQueryOptions<LocationResponseDto[]>> },
  queryClient?: QueryClient,
): UseQueryResult<LocationResponseDto[]> & { queryKey: QueryKey } {
  const queryOptions = getListAllLocationsQueryOptions(options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    LocationResponseDto[]
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useGetLocation(
  id: string,
  options?: { query?: Partial<UseQueryOptions<LocationResponseDto>> },
  queryClient?: QueryClient,
): UseQueryResult<LocationResponseDto> & { queryKey: QueryKey } {
  const queryOptions = getGetLocationQueryOptions(id, options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    LocationResponseDto
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useCreateLocation(
  options?: {
    mutation?: UseMutationOptions<
      LocationResponseDto,
      unknown,
      { data: CreateLocationDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  LocationResponseDto,
  unknown,
  { data: CreateLocationDto }
> {
  return useMutation(
    {
      mutationKey: ['createLocation'],
      mutationFn: async (vars) => await createLocation(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useUpdateLocation(
  options?: {
    mutation?: UseMutationOptions<
      LocationResponseDto,
      unknown,
      { id: string; data: UpdateLocationDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  LocationResponseDto,
  unknown,
  { id: string; data: UpdateLocationDto }
> {
  return useMutation(
    {
      mutationKey: ['updateLocation'],
      mutationFn: async (vars) => await updateLocation(vars.id, vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useDeleteLocation(
  options?: {
    mutation?: UseMutationOptions<void, unknown, { id: string }>
  },
  queryClient?: QueryClient,
): UseMutationResult<void, unknown, { id: string }> {
  return useMutation(
    {
      mutationKey: ['deleteLocation'],
      mutationFn: async (vars) => await deleteLocation(vars.id),
      ...options?.mutation,
    },
    queryClient,
  )
}
