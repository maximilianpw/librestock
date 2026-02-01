import {
  AuditAction,
  AuditEntityType,
  type AuditLogQueryDto,
  type AuditLogResponseDto,
  type PaginatedAuditLogsResponseDto,
} from '@librestock/types'
import {
  type QueryClient,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'
import { getAxiosInstance } from './axios-client'

export type {
  AuditLogQueryDto,
  AuditLogResponseDto,
  PaginatedAuditLogsResponseDto,
}
export { AuditAction, AuditEntityType }

export const getListAuditLogsQueryKey = (params?: AuditLogQueryDto) => {
  return ['/audit-logs', ...(params ? [params] : [])] as const
}

const listAuditLogs = async (
  params?: AuditLogQueryDto,
  signal?: AbortSignal,
) => {
  return await getAxiosInstance<PaginatedAuditLogsResponseDto>({
    url: '/audit-logs',
    method: 'GET',
    params,
    signal,
  })
}

export function getListAuditLogsQueryOptions(
  params?: AuditLogQueryDto,
  options?: { query?: Partial<UseQueryOptions<PaginatedAuditLogsResponseDto>> },
) {
  const queryKey = options?.query?.queryKey ?? getListAuditLogsQueryKey(params)
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await listAuditLogs(params, signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    PaginatedAuditLogsResponseDto,
    unknown,
    PaginatedAuditLogsResponseDto,
    QueryKey
  >
}

export function useListAuditLogs(
  params?: AuditLogQueryDto,
  options?: { query?: Partial<UseQueryOptions<PaginatedAuditLogsResponseDto>> },
  queryClient?: QueryClient,
): UseQueryResult<PaginatedAuditLogsResponseDto> & { queryKey: QueryKey } {
  const queryOptions = getListAuditLogsQueryOptions(params, options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    PaginatedAuditLogsResponseDto
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}
