const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('🔥 Server Error Captured:', err);

  // Prisma Unique Constraint Violation
  if (err.code === 'P2002') {
    const fields = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return errorResponse(
      res,
      `A record with this ${fields} already exists.`,
      'DUPLICATE_ENTRY',
      409
    );
  }

  // Prisma Record Not Found
  if (err.code === 'P2025') {
    return errorResponse(
      res,
      'The requested database record was not found.',
      'NOT_FOUND',
      404
    );
  }

  // Zod Validation Errors
  if (err.name === 'ZodError') {
    const errorDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return errorResponse(
      res,
      'Validation failed for request parameters',
      'VALIDATION_ERROR',
      400,
      errorDetails
    );
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid authentication token', 'INVALID_TOKEN', 401);
  }

  // Default Internal Error
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    'INTERNAL_ERROR',
    500
  );
};

module.exports = errorHandler;
