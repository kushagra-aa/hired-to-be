import { ApiError } from "@hiredtobe/shared/lib";
import { SuccessResponseType } from "@hiredtobe/shared/types";
import {
  InfiniteData,
  useInfiniteQuery as rqUseInfiniteQuery,
  useMutation as rqUseMutation,
  useQuery as rqUseQuery,
  UseInfiniteQueryResult,
  type QueryKey,
  type UseInfiniteQueryOptions,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

// ✅ Wrapper for useQuery
export function useAppQuery<TData, TQueryKey extends QueryKey>(
  options: Omit<
    UseQueryOptions<
      SuccessResponseType<TData>,
      ApiError,
      SuccessResponseType<TData>,
      TQueryKey
    >,
    "queryKey" | "queryFn"
  > & {
    queryKey: TQueryKey;
    queryFn: () => Promise<SuccessResponseType<TData>>;
  },
) {
  return rqUseQuery(options);
}

// ✅ Wrapper for useInfiniteQuery with correct return type
export function useAppInfiniteQuery<TData, TQueryKey extends QueryKey>(
  options: Omit<
    UseInfiniteQueryOptions<
      TData,
      ApiError,
      InfiniteData<TData>,
      TQueryKey,
      number | null
    >,
    "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
  > & {
    queryKey: TQueryKey;
    queryFn: (params: { pageParam: number | null }) => Promise<TData>;
    initialPageParam?: number | null;
    getNextPageParam: (lastPage: TData) => number | null | undefined;
  },
): UseInfiniteQueryResult<InfiniteData<TData>, ApiError> {
  return rqUseInfiniteQuery({
    ...options,
    initialPageParam: options.initialPageParam ?? null,
  });
}

// ✅ Wrapper for useMutation
export function useAppMutation<TData, TVariables>(
  options: UseMutationOptions<SuccessResponseType<TData>, ApiError, TVariables>,
) {
  return rqUseMutation(options);
}
