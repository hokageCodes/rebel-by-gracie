// Standardized error handling for API routes

export class AppError extends Error {
  constructor(message, statusCode = 500, code = null, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error types
export const errors = {
  // Authentication errors
  UNAUTHORIZED: (message = 'Authentication required') => 
    new AppError(message, 401, 'UNAUTHORIZED'),
  
  FORBIDDEN: (message = 'Access denied') => 
    new AppError(message, 403, 'FORBIDDEN'),
  
  TOKEN_EXPIRED: (message = 'Token has expired') => 
    new AppError(message, 401, 'TOKEN_EXPIRED'),
  
  INVALID_CREDENTIALS: (message = 'Invalid email or password') => 
    new AppError(message, 401, 'INVALID_CREDENTIALS'),
  
  EMAIL_NOT_VERIFIED: (message = 'Email not verified') => 
    new AppError(message, 403, 'EMAIL_NOT_VERIFIED', { requiresVerification: true }),

  // Validation errors
  VALIDATION_ERROR: (message = 'Validation failed', details = null) => 
    new AppError(message, 400, 'VALIDATION_ERROR', details),
  
  REQUIRED_FIELD: (field) => 
    new AppError(`${field} is required`, 400, 'REQUIRED_FIELD', { field }),
  
  INVALID_FORMAT: (field, format) => 
    new AppError(`${field} must be in ${format} format`, 400, 'INVALID_FORMAT', { field, format }),

  // Resource errors
  NOT_FOUND: (resource = 'Resource') => 
    new AppError(`${resource} not found`, 404, 'NOT_FOUND'),
  
  ALREADY_EXISTS: (resource, field = 'id') => 
    new AppError(`${resource} with this ${field} already exists`, 409, 'ALREADY_EXISTS'),
  
  CONFLICT: (message = 'Resource conflict') => 
    new AppError(message, 409, 'CONFLICT'),

  // Business logic errors
  INSUFFICIENT_INVENTORY: (product, requested, available) => 
    new AppError(`Insufficient inventory for ${product}. Requested: ${requested}, Available: ${available}`, 400, 'INSUFFICIENT_INVENTORY'),
  
  ORDER_CANNOT_BE_MODIFIED: (orderNumber, reason = 'Order cannot be modified') => 
    new AppError(`Order ${orderNumber}: ${reason}`, 400, 'ORDER_CANNOT_BE_MODIFIED'),
  
  PAYMENT_FAILED: (message = 'Payment processing failed') => 
    new AppError(message, 402, 'PAYMENT_FAILED'),

  // System errors
  INTERNAL_ERROR: (message = 'Internal server error') => 
    new AppError(message, 500, 'INTERNAL_ERROR'),
  
  DATABASE_ERROR: (message = 'Database operation failed') => 
    new AppError(message, 500, 'DATABASE_ERROR'),
  
  EXTERNAL_SERVICE_ERROR: (service, message = 'External service unavailable') => 
    new AppError(`${service}: ${message}`, 503, 'EXTERNAL_SERVICE_ERROR'),
  
  RATE_LIMIT_EXCEEDED: (message = 'Too many requests') => 
    new AppError(message, 429, 'RATE_LIMIT_EXCEEDED'),
};

// Error response formatter
export function formatErrorResponse(error, includeStack = false) {
  const response = {
    error: true,
    message: error.message,
    code: error.code || 'UNKNOWN_ERROR',
  };

  if (error.details) {
    response.details = error.details;
  }

  if (includeStack && process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  return response;
}

// Main error handler
export function handleError(error) {
  console.error('Error occurred:', {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  // Handle known errors
  if (error instanceof AppError) {
    return Response.json(
      formatErrorResponse(error),
      { status: error.statusCode }
    );
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const details = {};
    Object.values(error.errors).forEach(err => {
      details[err.path] = err.message;
    });
    
    return Response.json(
      formatErrorResponse(errors.VALIDATION_ERROR('Validation failed', details)),
      { status: 400 }
    );
  }

  // Handle Mongoose duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return Response.json(
      formatErrorResponse(errors.ALREADY_EXISTS('Resource', field)),
      { status: 409 }
    );
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return Response.json(
      formatErrorResponse(errors.UNAUTHORIZED('Invalid token')),
      { status: 401 }
    );
  }

  if (error.name === 'TokenExpiredError') {
    return Response.json(
      formatErrorResponse(errors.TOKEN_EXPIRED()),
      { status: 401 }
    );
  }

  // Handle default errors
  return Response.json(
    formatErrorResponse(errors.INTERNAL_ERROR()),
    { status: 500 }
  );
}

// Async error wrapper
export function asyncHandler(fn) {
  return async (request, context) => {
    try {
      return await fn(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}

// Success response formatter
export function successResponse(data = null, message = 'Success', statusCode = 200) {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return Response.json(response, { status: statusCode });
}

// Pagination response formatter
export function paginatedResponse(data, pagination, message = 'Success') {
  return successResponse({
    items: data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 20)),
      hasNext: (pagination.page || 1) < Math.ceil((pagination.total || 0) / (pagination.limit || 20)),
      hasPrev: (pagination.page || 1) > 1,
    },
  }, message);
}

