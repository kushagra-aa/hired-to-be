import { StatusCode } from "./statusCode.types";

export type BaseResponseType = {
  status: StatusCode;
  message: string;
  success?: boolean;
};

export type PaginationResponseType = {
  count: number;
  page: number;
  pageSize: number;
};

export type CursorPaginationResponseType = {
  nextCursor?: number;
  pageSize: number;
  count: number;
  hasMore: boolean;
};

export type ErrorResponseType = {
  errors?: Record<string, string[]>;
  error: string;
  data?: undefined;
} & BaseResponseType;

export type SuccessResponseType<T = unknown> =
  | (BaseResponseType & {
      data: T;
      pagination: PaginationResponseType;
      error?: undefined;
    })
  | (BaseResponseType & {
      data: T;
      cursorPagination: CursorPaginationResponseType;
      error?: undefined;
    })
  | (BaseResponseType & {
      data: T;
      error?: undefined; // still allow no pagination
    });

export type ServiceReturnType<T = unknown> = Promise<
  | {
      data: T;
      pagination: PaginationResponseType;
      cursorPagination?: undefined;
      error?: undefined;
    }
  | {
      data: T;
      cursorPagination: CursorPaginationResponseType;
      pagination?: undefined;
      error?: undefined;
    }
  | {
      data: T;
      cursorPagination?: undefined;
      pagination?: undefined;
      error?: undefined; // still allow no pagination
    }
  | ErrorResponseType
>;

export type RegistryReturnType<T = unknown> = Promise<
  ErrorResponseType | SuccessResponseType<T>
>;
