import { ApiError } from "@hiredtobe/shared/lib";
import { SuccessResponseType } from "@hiredtobe/shared/types";
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
