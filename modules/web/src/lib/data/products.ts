import {
  ProductSortField,
  SortOrder,
  type BulkCreateProductsDto,
  type BulkDeleteDto,
  type BulkOperationResultDto,
  type BulkRestoreDto,
  type BulkUpdateStatusDto,
  type CreateProductDto,
  type PaginatedProductsResponseDto,
  type ProductQueryDto,
  type ProductResponseDto,
  type UpdateProductDto,
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
  BulkCreateProductsDto,
  BulkDeleteDto,
  BulkOperationResultDto,
  BulkRestoreDto,
  BulkUpdateStatusDto,
  CreateProductDto,
  PaginatedProductsResponseDto,
  ProductQueryDto,
  ProductResponseDto,
  UpdateProductDto,
}
export { ProductSortField, SortOrder }

export const getListProductsQueryKey = (params?: ProductQueryDto) => {
  return ['/products', ...(params ? [params] : [])] as const
}

export const getGetProductsByCategoryQueryKey = (categoryId?: string) => {
  return ['/products/category', categoryId] as const
}

const listProducts = async (params?: ProductQueryDto, signal?: AbortSignal) => {
  return await getAxiosInstance<PaginatedProductsResponseDto>({
    url: '/products',
    method: 'GET',
    params,
    signal,
  })
}

const listAllProducts = async (signal?: AbortSignal) => {
  return await getAxiosInstance<ProductResponseDto[]>({
    url: '/products/all',
    method: 'GET',
    signal,
  })
}

const getProduct = async (id: string, signal?: AbortSignal) => {
  return await getAxiosInstance<ProductResponseDto>({
    url: `/products/${id}`,
    method: 'GET',
    signal,
  })
}

const getProductsByCategory = async (
  categoryId: string,
  signal?: AbortSignal,
) => {
  return await getAxiosInstance<ProductResponseDto[]>({
    url: `/products/category/${categoryId}`,
    method: 'GET',
    signal,
  })
}

const createProduct = async (data: CreateProductDto) => {
  return await getAxiosInstance<ProductResponseDto>({
    url: '/products',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

const updateProduct = async (id: string, data: UpdateProductDto) => {
  return await getAxiosInstance<ProductResponseDto>({
    url: `/products/${id}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

const deleteProduct = async (id: string) => {
  return await getAxiosInstance<ProductResponseDto>({
    url: `/products/${id}`,
    method: 'DELETE',
  })
}

const bulkCreateProducts = async (data: BulkCreateProductsDto) => {
  return await getAxiosInstance<BulkOperationResultDto>({
    url: '/products/bulk',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

const bulkDeleteProducts = async (data: BulkDeleteDto) => {
  return await getAxiosInstance<BulkOperationResultDto>({
    url: '/products/bulk',
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

const bulkUpdateProductStatus = async (data: BulkUpdateStatusDto) => {
  return await getAxiosInstance<BulkOperationResultDto>({
    url: '/products/bulk/status',
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

const bulkRestoreProducts = async (data: BulkRestoreDto) => {
  return await getAxiosInstance<BulkOperationResultDto>({
    url: '/products/bulk/restore',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

export function getListProductsQueryOptions(
  params?: ProductQueryDto,
  options?: { query?: Partial<UseQueryOptions<PaginatedProductsResponseDto>> },
) {
  const queryKey = options?.query?.queryKey ?? getListProductsQueryKey(params)
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await listProducts(params, signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    PaginatedProductsResponseDto,
    unknown,
    PaginatedProductsResponseDto,
    QueryKey
  >
}

export function getGetProductsByCategoryQueryOptions(
  categoryId?: string,
  options?: { query?: Partial<UseQueryOptions<ProductResponseDto[]>> },
) {
  const queryKey =
    options?.query?.queryKey ?? getGetProductsByCategoryQueryKey(categoryId)
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await getProductsByCategory(categoryId ?? '', signal)
  return { queryKey, queryFn, ...options?.query } as UseQueryOptions<
    ProductResponseDto[],
    unknown,
    ProductResponseDto[],
    QueryKey
  >
}

export function useListProducts(
  params?: ProductQueryDto,
  options?: { query?: Partial<UseQueryOptions<PaginatedProductsResponseDto>> },
  queryClient?: QueryClient,
): UseQueryResult<PaginatedProductsResponseDto> & { queryKey: QueryKey } {
  const queryOptions = getListProductsQueryOptions(params, options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    PaginatedProductsResponseDto
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useListAllProducts(
  options?: { query?: Partial<UseQueryOptions<ProductResponseDto[]>> },
  queryClient?: QueryClient,
): UseQueryResult<ProductResponseDto[]> & { queryKey: QueryKey } {
  const queryKey = options?.query?.queryKey ?? ['/products/all']
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await listAllProducts(signal)
  const query = useQuery(
    { queryKey, queryFn, ...options?.query } as UseQueryOptions<
      ProductResponseDto[],
      unknown,
      ProductResponseDto[],
      QueryKey
    >,
    queryClient,
  ) as UseQueryResult<ProductResponseDto[]> & { queryKey: QueryKey }
  return { ...query, queryKey }
}

export function useGetProduct(
  id: string,
  options?: { query?: Partial<UseQueryOptions<ProductResponseDto>> },
  queryClient?: QueryClient,
): UseQueryResult<ProductResponseDto> & { queryKey: QueryKey } {
  const queryKey = options?.query?.queryKey ?? [`/products/${id}`]
  const queryFn = async ({ signal }: { signal?: AbortSignal }) =>
    await getProduct(id, signal)
  const query = useQuery(
    { queryKey, queryFn, ...options?.query } as UseQueryOptions<
      ProductResponseDto,
      unknown,
      ProductResponseDto,
      QueryKey
    >,
    queryClient,
  ) as UseQueryResult<ProductResponseDto> & { queryKey: QueryKey }
  return { ...query, queryKey }
}

export function useGetProductsByCategory(
  categoryId: string,
  options?: { query?: Partial<UseQueryOptions<ProductResponseDto[]>> },
  queryClient?: QueryClient,
): UseQueryResult<ProductResponseDto[]> & { queryKey: QueryKey } {
  const queryOptions = getGetProductsByCategoryQueryOptions(categoryId, options)
  const query = useQuery(queryOptions, queryClient) as UseQueryResult<
    ProductResponseDto[]
  > & { queryKey: QueryKey }
  return { ...query, queryKey: queryOptions.queryKey }
}

export function useCreateProduct(
  options?: {
    mutation?: UseMutationOptions<
      ProductResponseDto,
      unknown,
      { data: CreateProductDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  ProductResponseDto,
  unknown,
  { data: CreateProductDto }
> {
  return useMutation(
    {
      mutationKey: ['createProduct'],
      mutationFn: async (vars) => await createProduct(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useUpdateProduct(
  options?: {
    mutation?: UseMutationOptions<
      ProductResponseDto,
      unknown,
      { id: string; data: UpdateProductDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  ProductResponseDto,
  unknown,
  { id: string; data: UpdateProductDto }
> {
  return useMutation(
    {
      mutationKey: ['updateProduct'],
      mutationFn: async (vars) => await updateProduct(vars.id, vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useDeleteProduct(
  options?: {
    mutation?: UseMutationOptions<
      ProductResponseDto,
      unknown,
      { id: string }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<ProductResponseDto, unknown, { id: string }> {
  return useMutation(
    {
      mutationKey: ['deleteProduct'],
      mutationFn: async (vars) => await deleteProduct(vars.id),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useBulkCreateProducts(
  options?: {
    mutation?: UseMutationOptions<
      BulkOperationResultDto,
      unknown,
      { data: BulkCreateProductsDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  BulkOperationResultDto,
  unknown,
  { data: BulkCreateProductsDto }
> {
  return useMutation(
    {
      mutationKey: ['bulkCreateProducts'],
      mutationFn: async (vars) => await bulkCreateProducts(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useBulkUpdateProductStatus(
  options?: {
    mutation?: UseMutationOptions<
      BulkOperationResultDto,
      unknown,
      { data: BulkUpdateStatusDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  BulkOperationResultDto,
  unknown,
  { data: BulkUpdateStatusDto }
> {
  return useMutation(
    {
      mutationKey: ['bulkUpdateProductStatus'],
      mutationFn: async (vars) =>
        await bulkUpdateProductStatus(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useBulkDeleteProducts(
  options?: {
    mutation?: UseMutationOptions<
      BulkOperationResultDto,
      unknown,
      { data: BulkDeleteDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  BulkOperationResultDto,
  unknown,
  { data: BulkDeleteDto }
> {
  return useMutation(
    {
      mutationKey: ['bulkDeleteProducts'],
      mutationFn: async (vars) => await bulkDeleteProducts(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}

export function useBulkRestoreProducts(
  options?: {
    mutation?: UseMutationOptions<
      BulkOperationResultDto,
      unknown,
      { data: BulkRestoreDto }
    >
  },
  queryClient?: QueryClient,
): UseMutationResult<
  BulkOperationResultDto,
  unknown,
  { data: BulkRestoreDto }
> {
  return useMutation(
    {
      mutationKey: ['bulkRestoreProducts'],
      mutationFn: async (vars) => await bulkRestoreProducts(vars.data),
      ...options?.mutation,
    },
    queryClient,
  )
}
