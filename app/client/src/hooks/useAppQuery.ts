import { ApiError } from "@shared/lib/api/index.js";
import { SuccessResponseType } from "@shared/types/api.types.js";
import {
  useMutation as rqUseMutation,
  useQuery as rqUseQuery,
  type QueryKey,
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

// ✅ Wrapper for useMutation
export function useAppMutation<TData, TVariables>(
  options: UseMutationOptions<SuccessResponseType<TData>, ApiError, TVariables>,
) {
  return rqUseMutation(options);
}
