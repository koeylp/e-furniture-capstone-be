"use strict";

const logger = require("./logger");

const StatusCode = {
  FORBIDDEN: 403,
  NOTFOUND: 404,
  CONFLICT: 409,
  BADREQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL: 500,
};
const ReasonStatusCode = {
  BADREQUEST: "Bad Request",
  NOTFOUND: "Not Found",
  CONFLICT: "Your Account Had Been Login From Another Location!",
  FORBIDDEN: "Access denied",
  UNAUTHORIZED: "Unauthorized",
  INTERNAL: "Internal Server Error",
};
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;

    // winston logger
    logger.error(`${this.status} -- ${this.message}`);
  }
}
class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BADREQUEST,
    status = StatusCode.BADREQUEST
  ) {
    super(message, status);
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}
class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOTFOUND,
    statusCode = StatusCode.NOTFOUND
  ) {
    super(message, statusCode);
  }
}
class UnAuthorizedError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}
class InternalServerError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.INTERNAL,
    statusCode = StatusCode.INTERNAL
  ) {
    super(message, statusCode);
  }
}
module.exports = {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnAuthorizedError,
  InternalServerError,
};
