/** Shared response messages so wording stays identical across APIs. */
export const MESSAGES = {
  AUTH: {
    REGISTERED: "Account created successfully",
    LOGGED_IN: "Logged in successfully",
    PROFILE_FETCHED: "Profile fetched successfully",
    INVALID_CREDENTIALS: "Invalid email or password",
    EMAIL_EXISTS: "An account with this email already exists",
    TOKEN_MISSING: "Authentication token is missing",
    TOKEN_INVALID: "Authentication token is invalid or expired",
    USER_NOT_FOUND: "User no longer exists",
    ACCOUNT_DISABLED: "This account has been disabled",
    FORBIDDEN_ROLE: "Your role is not allowed to access this resource",
  },
  COMMON: {
    ROUTE_NOT_FOUND: "Route not found",
    SERVER_ERROR: "Something went wrong",
    VALIDATION_FAILED: "Validation failed",
  },
} as const;
