export const ERROR_MESSAGES = {
  VALIDATION: {
    MIN_LENGTH: "Please enter a valid email or username (minimum 3 characters).",
    INVALID_EMAIL: "Please enter a valid email address.",
    NO_SPACES: "Please enter a valid email or username (no spaces allowed).",
  },
  API: {
    UNAUTHORIZED: "Please check your API key in the preferences.",
    RATE_LIMIT: "Please wait before making other searches.",
    FORBIDDEN: "Please check your subscription status or limits.",
    INVALID_SEARCH: "Unable to determine search type.",
    UNKNOWN: "An unexpected error occurred.",
  },
  UI: {
    ERROR_TITLE: "Error fetching data",
    INVALID_INPUT: "Invalid input",
    UNEXPECTED_ERROR: "An unexpected error occurred",
  },
} as const; 