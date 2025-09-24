import axios, {
  AxiosError,
  AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import {
  ErrorResponseType,
  StatusCode,
  SuccessResponseType,
} from "@/shared/types";

export function objectToFormData(
  obj: Record<string, string | number>,
): FormData {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, `${value}`);
  });
  return formData;
}

export const formDataToJson = (formData: FormData) => {
  return Object.fromEntries(formData.entries());
};

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Custom error class to provide consistent error information to the caller
export class ApiError extends Error {
  statusCode: StatusCode;
  data: ErrorResponseType | undefined;
  originalError: AxiosError | Error | undefined;

  constructor(
    message: string,
    statusCode: StatusCode = 500,
    data?: ErrorResponseType,
    originalError?: AxiosError | Error,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.data = data;

    // This line is needed to correctly set the prototype chain for custom errors
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// --- API Methods Wrapper Class ---
export class APIClient {
  baseURL?: string;

  private axiosInstance: AxiosInstance;

  constructor(baseURL?: string) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
      headers: DEFAULT_HEADERS,
      timeout: 15000, // Request timeout in milliseconds
      withCredentials: true,
    });

    // Request Interceptor: Before sending a request
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Can modify the request config here, e.g., add dynamic auth token
        return config;
      },
      (error) => {
        // Handle request error
        return Promise.reject(error);
      },
    );

    // Response Interceptor: After receiving a response (or error)
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Can transform the response data here
        return response.data; // Return only the data part of the response
      },
      (error: AxiosError) => {
        // Handle response errors (e.g., 401 Unauthorized, 404 Not Found)
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("API Error Response:", error.response.data);
          console.error("API Error Status:", error.response.status);
          console.error("API Error Headers:", error.response.headers);

          switch (error.response.status) {
            case 401:
              // Unauthorized: e.g., redirect to login page
              console.error("Unauthorized: Please log in again.");
              break;
            case 403:
              // Forbidden: User doesn't have permission
              console.error(
                "Forbidden: You do not have permission to access this resource.",
              );
              break;
            case 404:
              // Not Found
              console.error("Not Found: The requested resource was not found.");
              break;
            case 500:
              // Server Error
              console.error(
                "Server Error: Something went wrong on the server.",
              );
              break;
            default:
              console.error(`Unhandled API error: ${error.response.status}`);
          }
          // You might want to re-throw a custom error or return a specific error object
          return Promise.reject(
            new ApiError(
              error.message,
              error.response.status as StatusCode,
              (error.response.data ||
                error.response) as unknown as ErrorResponseType,
              error,
            ),
          );
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error("Network Error: No response received.", error.request);
          return Promise.reject(
            new Error("Network Error: Please check your internet connection."),
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Request Setup Error:", error.message);
          return Promise.reject(new Error(`Request Error: ${error.message}`));
        }
      },
    );
  }

  /**
   * Performs a GET request.
   * @param {string} url - The endpoint URL.
   * @param {object} params - Query parameters.
   * @param {object} config - Axios request config.
   * @returns {Promise<SuccessResponseType<T>>} - Promise resolving to the response data.
   */
  get<T = unknown>(
    url: string,
    params: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<SuccessResponseType<T>> {
    return this.axiosInstance.get(url, { ...config, params });
  }

  /**
   * Performs a POST request.
   * @param {string} url - The endpoint URL.
   * @param {object} data - The request body data.
   * @param {object} config - Axios request config.
   * @returns {Promise<SuccessResponseType<T>>} - Promise resolving to the response data.
   */
  post<T = unknown>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<SuccessResponseType<T>> {
    return this.axiosInstance.post(url, data, config);
  }

  /**
   * Performs a PUT request.
   * @param {string} url - The endpoint URL.
   * @param {object} data - The request body data.
   * @param {object} config - Axios request config.
   * @returns {Promise<SuccessResponseType<T>>} - Promise resolving to the response data.
   */
  put<T = unknown>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<SuccessResponseType<T>> {
    return this.axiosInstance.put(url, data, config);
  }

  /**
   * Performs a PATCH request.
   * @param {string} url - The endpoint URL.
   * @param {object} data - The request body data (partial update).
   * @param {object} config - Axios request config.
   * @returns {Promise<SuccessResponseType<T>>} - Promise resolving to the response data.
   */
  patch<T = unknown>(
    url: string,
    data: unknown = {},
    config: AxiosRequestConfig = {},
  ): Promise<SuccessResponseType<T>> {
    return this.axiosInstance.patch(url, data, config);
  }

  /**
   * Performs a DELETE request.
   * @param {string} url - The endpoint URL.
   * @param {object} config - Axios request config (e.g., for sending data with DELETE, though less common).
   * @returns {Promise<SuccessResponseType<T>>} - Promise resolving to the response data.
   */
  delete<T = unknown>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<SuccessResponseType<T>> {
    return this.axiosInstance.delete(url, config);
  }
}
