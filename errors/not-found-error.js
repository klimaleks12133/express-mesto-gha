const { STATUS_404 } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = STATUS_404;
    this.message = message;
  }
}
module.exports = NotFoundError;
