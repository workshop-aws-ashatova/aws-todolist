'use strict';

class HTTPError extends Error {
  constructor(status_code, error_message) {
    super(error_message);
    this.status_code = status_code;
    this.error_message = error_message;
  }
}

class HTTPBadRequestError extends HTTPError {
  constructor(error_message = 'Bad Request') {
    super(400, error_message);
  }
}
class HTTPNotFoundError extends HTTPError {
  constructor(error_message = 'Not Found') {
    super(404, error_message);
  }
}
class HTTPInternalServerError extends HTTPError {
  constructor(error_message = 'Unexpected Exception') {
    super(500, error_message);
  }
}

module.exports = {
  HTTPError,
  HTTPInternalServerError,
  HTTPBadRequestError,
  HTTPNotFoundError
};
