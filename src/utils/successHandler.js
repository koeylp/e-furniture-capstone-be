const StatusCode = {
  OK: 200,
  CREATED: 201,
};
const ReasonStatusCode = {
  OK: "Success",
  CREATED: "Created",
};
class SuccessRespone {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatus = ReasonStatusCode.OK,
    metaData,
  }) {
    this.message = !message ? reasonStatus : message;
    this.status = statusCode;
    this.metaData = metaData;
  }

  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}
class OK extends SuccessRespone {
  constructor({ message, metaData = [] }) {
    super({ message, metaData });
  }
}
class CREATED extends SuccessRespone {
  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatus = ReasonStatusCode.CREATED,
    metaData = [],
  }) {
    super({ message, statusCode, reasonStatus, metaData });
  }
}
module.exports = {
  OK,
  CREATED,
};
