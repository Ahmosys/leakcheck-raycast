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
    MIN_LENGTH: "Please enter a valid email or username (minimum 3 characters).",
    /** Error when email format is invalid */
    INVALID_EMAIL: "Please enter a valid email address.",
    /** Error when input contains spaces */
    NO_SPACES: "Please enter a valid email or username (no spaces allowed).",
  },
  /**
   * API-related error messages
   */
  API: {
    /** Authentication error - invalid or missing API key */
    UNAUTHORIZED: "Please check your API key in the preferences.",
    /** Rate limiting error */
    RATE_LIMIT: "Please wait before making other searches.",
    /** Authorization error - subscription or limit issues */
    FORBIDDEN: "Please check your subscription status or limits.",
    /** Invalid search parameters or format */
    INVALID_SEARCH: "Unable to determine search type.",
    /** Generic API error */
    UNKNOWN: "An unexpected error occurred.",
  },
  /**
   * UI-related error messages
   */
  UI: {
    /** Generic error title for data fetching issues */
    ERROR_TITLE: "Error fetching data",
    /** Invalid user input error title */
    INVALID_INPUT: "Invalid input",
    /** Generic error title for unexpected issues */
    UNEXPECTED_ERROR: "An unexpected error occurred",
  },
} as const;
