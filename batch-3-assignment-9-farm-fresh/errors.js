// Centralized application error types & helpers for Server Actions / data layer.
// Each custom error includes an HTTP-ish status and stable code string.

class AppError extends Error {
  /**
   * @param {string} message
   * @param {string} code stable machine readable code (e.g. NOT_FOUND)
   * @param {number} status http-style status (used by route error boundaries)
   * @param {object} [meta] optional extra context (NOT SERIALIZED automatically)
   */
  constructor(message, code = "APP_ERROR", status = 400, meta) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    if (meta) this.meta = meta;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found", meta) {
    super(message, "NOT_FOUND", 404, meta);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", meta) {
    super(message, "UNAUTHORIZED", 401, meta);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden", meta) {
    super(message, "FORBIDDEN", 403, meta);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed", meta) {
    super(message, "VALIDATION_ERROR", 422, meta);
  }
}

// Map unknown errors to a safe serializable shape for actions.
function serializeError(err) {
  if (!err) return { code: "UNKNOWN", message: "Unknown error" };
  if (err instanceof AppError) {
    return { code: err.code, message: err.message };
  }
  // Recognize some common message -> typed code (backwards compatibility)
  const msg = err.message || "Internal error";
  if (msg === "Unauthorized") return { code: "UNAUTHORIZED", message: msg };
  if (msg === "Forbidden") return { code: "FORBIDDEN", message: msg };
  if (/not found/i.test(msg)) return { code: "NOT_FOUND", message: msg };
  return { code: "INTERNAL_ERROR", message: msg };
}

// Helper to build a standardized failed action result
function toActionError(err) {
  return { ok: false, error: serializeError(err) };
}

export {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ValidationError,
  serializeError,
  toActionError,
};
