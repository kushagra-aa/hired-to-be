import { StatusCode } from "./statusCode.types";

export type BaseResponseType = {
  status: StatusCode;
  message: string;
  success?: boolean;
};

export type ErrorResponseType = {
  errors?: Record<string, string[]>;
  error: string;
  data?: undefined;
} & BaseResponseType;

export type SuccessResponseType<T = unknown> = {
  data: T;
  count?: number;
  page?: number;
  pageSize?: number;
  error?: undefined;
} & BaseResponseType;

export type RegistryReturnType<T = unknown> = Promise<
  ErrorResponseType | SuccessResponseType<T>
>;
