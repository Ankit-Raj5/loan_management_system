// Base error class carrying status code, machine-readable code and optional details for the error handler
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = new.target.name;
    Error.captureStackTrace?.(this, new.target);
  }
}

// 400 error for malformed or unusable requests
export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: unknown) {
    super(400, message, "BAD_REQUEST", details);
  }
}

// 422 error for failed input validation, with per-field details
export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(422, message, "VALIDATION_ERROR", details);
  }
}

// 401 error for missing, invalid or failed authentication
export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(401, message, "UNAUTHORIZED");
  }
}

// 403 error for authenticated users lacking the required role
export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(403, message, "FORBIDDEN");
  }
}

// 422 error for applications rejected by the Business Rule Engine, with the failed rules as details
export class BusinessRuleError extends AppError {
  constructor(message = "Application rejected by eligibility rules", details?: unknown) {
    super(422, message, "BRE_REJECTED", details);
  }
}

// 404 error for missing resources or routes
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message, "NOT_FOUND");
  }
}

// 409 error for duplicate or conflicting resources
export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(409, message, "CONFLICT");
  }
}

// 502 error for failures talking to the external file storage (Cloudinary)
export class StorageError extends AppError {
  constructor(message = "File storage service failed") {
    super(502, message, "STORAGE_ERROR");
  }
}

// 500 error for unexpected server failures
export class InternalServerError extends AppError {
  constructor(message = "Something went wrong") {
    super(500, message, "INTERNAL_SERVER_ERROR");
  }
}
