import type { BrandingResponseDto, UpdateBrandingDto } from '@librestock/types'
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

export type { BrandingResponseDto, UpdateBrandingDto }

export const getBrandingControllerGetQueryKey = () => ['/branding'] as const

const brandingControllerGet = async (signal?: AbortSignal) => {
  return await getAxiosInstance<BrandingResponseDto>({
    url: '/branding',
    method: 'GET',
    signal,
  })
}

const brandingControllerUpdate = async (data: UpdateBrandingDto) => {
  return await getAxiosInstance<BrandingResponseDto>({
    url: '/branding',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

export function getBrandingControllerGetQueryOptions(
  options?: { query?: Partial<UseQueryOptions<BrandingResponseDto>> },
) {
  const queryKey = options?.query?.queryKey ?? getBrandingControllerGetQueryKey()
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await brandingControllerGet(signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    BrandingResponseDto,
    unknown,
    BrandingResponseDto,
    QueryKey
  >
}

export function useBrandingControllerGet(
  options?: { query?: Partial<UseQueryOptions<BrandingResponseDto>> },
  queryClient?: QueryClient,
): UseQueryResult<BrandingResponseDto> & { queryKey: QueryKey } {
  const queryOptions = getBrandingControllerGetQueryOptions(options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    BrandingResponseDto
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useBrandingControllerUpdate(
  options?: {
    mutation?: UseMutationOptions<
      BrandingResponseDto,
      unknown,
      { data: UpdateBrandingDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  BrandingResponseDto,
  unknown,
  { data: UpdateBrandingDto }
> {
  return useMutation(
    {
      mutationKey: ['brandingControllerUpdate'],
      mutationFn: async (vars) => await brandingControllerUpdate(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}
