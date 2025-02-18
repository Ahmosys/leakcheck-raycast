import { useFetch } from "@raycast/utils";
import { ApiResponse } from "@/types/breach";
import { APIError, handleError } from "@/utils/error";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

/**
 * Custom hook to fetch data breaches for a given email address
 * @param email - The email address to check for breaches
 * @param apiKey - The API key for authentication
 * @returns Object containing loading state, response data and potential error
 */
export function useFetchBreaches(email: string, apiKey: string) {
  const { isLoading, data, error } = useFetch<ApiResponse>(
    `https://leakcheck.io/api/v2/query/${encodeURIComponent(email)}`,
    {
      headers: { "X-API-Key": apiKey },
      execute: !!email,
      onError: (error: Error & { response?: { status: number } }) => {
        const statusCode = error.response?.status || 500;
        const message = getErrorMessage(statusCode);
        handleError(new APIError(statusCode, message));
      },
    },
  );

  return { isLoading, data, error };
}

/**
 * Maps API status codes to human-readable error messages
 * @param statusCode - HTTP status code returned by the API
 * @returns Corresponding error message from ERROR_MESSAGES constant
 */
function getErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 401:
      return ERROR_MESSAGES.API.UNAUTHORIZED;
    case 429:
      return ERROR_MESSAGES.API.RATE_LIMIT;
    case 403:
      return ERROR_MESSAGES.API.FORBIDDEN;
    case 422:
      return ERROR_MESSAGES.API.INVALID_SEARCH;
    default:
      return ERROR_MESSAGES.API.UNKNOWN;
  }
}
