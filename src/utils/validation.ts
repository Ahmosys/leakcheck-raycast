import { ValidationError } from "@/utils/error";
import { ERROR_MESSAGES } from "@/constants/errorMessages";

/**
 * Validates a search query string for email or username format
 * Performs the following checks:
 * - Minimum length of 3 characters
 * - Valid email format if query contains '@'
 * - No spaces allowed in the query
 *
 * @param query - The search query string to validate
 * @throws {ValidationError} If any validation check fails
 */
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
