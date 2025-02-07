module.exports = class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.name = "DocumentNotFoundError"
  }
}

module.exports= class NotFoundError extends Error  {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports.Error = (res, err) => {
  if(err.name  === "DocumentNotFoundError") {
    res.status(404);
  }
}

const NOT_FOUND_ERROR = 404;
const SERVER_ERROR = 500;
const INVALID_DATA = 400;

module.exports  = {
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  INVALID_DATA
}