/**
 * Constant object containing all error messages used throughout the application
 * Organized into three main categories:
 * - VALIDATION: User input validation errors
 * - API: Server and API-related errors
 * - UI: General user interface errors
 */
export const ERROR_MESSAGES = {
  /**
   * Validation error messages for user inputs
   */
  VALIDATION: {
    /** Error when input length is less than 3 characters */
    MIN_LENGTH: "Please enter at least 3 characters",
    /** Error when email format is invalid */
    INVALID_EMAIL: "Please enter a valid email address (e.g., user@domain.com)",
    /** Error when input contains spaces */
    NO_SPACES: "Email or username cannot contain spaces",
  },
  /**
   * API-related error messages
   */
  API: {
    /** Authentication error - invalid or missing API key */
    UNAUTHORIZED: "Invalid API key. Please check your API key in preferences",
    /** Rate limiting error */
    RATE_LIMIT: "Too many requests. Please try again later",
    /** Authorization error - subscription or limit issues */
    FORBIDDEN: "Access denied. Please check your subscription status",
    /** Invalid search parameters or format */
    INVALID_SEARCH: "Invalid search parameters",
    /** Generic API error */
    UNKNOWN: "An unexpected error occurred. Please try again",
  },
  /**
   * UI-related error messages
   */
  UI: {
    /** Generic error title for data fetching issues */
    ERROR_TITLE: "Error",
    /** Invalid user input error title */
    INVALID_INPUT: "Invalid Input",
    /** Generic error title for unexpected issues */
    UNEXPECTED_ERROR: "Unexpected Error",
  },
} as const;
