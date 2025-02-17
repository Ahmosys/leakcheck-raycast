import { Toast, showToast } from "@raycast/api";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "APIError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function handleError(error: Error): void {
  if (error instanceof APIError) {
    showToast({
      style: Toast.Style.Failure,
      title: getErrorTitle(error.statusCode),
      message: error.message,
    });
  } else if (error instanceof ValidationError) {
    showToast({
      style: Toast.Style.Failure,
      title: ERROR_MESSAGES.UI.INVALID_INPUT,
      message: error.message,
    });
  } else {
    showToast({
      style: Toast.Style.Failure,
      title: ERROR_MESSAGES.UI.UNEXPECTED_ERROR,
      message: ERROR_MESSAGES.API.UNKNOWN,
    });
  }
}

function getErrorTitle(statusCode: number): string {
  switch (statusCode) {
    case 401:
      return "Authentication Error";
    case 429:
      return "Too many requests";
    case 403:
      return "Access denied";
    case 422:
      return "Invalid search";
    default:
      return "API Error";
  }
} 