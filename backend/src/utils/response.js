/**
 * Standard Success Response Formatter
 */
const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data
  });
};

/**
 * Standard Error Response Formatter
 */
const errorResponse = (res, message = 'Something went wrong', errorCode = 'SERVER_ERROR', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    ...(details && { details })
  });
};

module.exports = {
  successResponse,
  errorResponse
};
