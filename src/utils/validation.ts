import { ValidationError } from "./errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export function validateQuery(query: string): void {
  if (query.length < 3) {
    throw new ValidationError(ERROR_MESSAGES.VALIDATION.MIN_LENGTH);
  }
  if (query.includes("@")) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(query)) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL);
    }
  }
  if (query.includes(" ")) {
    throw new ValidationError(ERROR_MESSAGES.VALIDATION.NO_SPACES);
  }
} 