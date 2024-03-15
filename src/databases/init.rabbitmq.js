const amqp = require("amqplib");
const { RabbitMQErrorResponse } = require("../utils/errorHanlder");

let client = {};
let statusConnectRabbitMQ = {
  CONNECTED: "connect",
  CLOSED: "close",
  ERROR: "error",
};

const RABBITMQ_CONNECT_TIMEOUT = 10000;
const RABBITMQ_CONNECT_MESSAGE = {
  CODE: -99,
  MESSAGE: {
    vn: "RabbitMQ Kết Nối Lỗi!",
    en: "Service connection RabbitMQ error!",
  },
};

let connectionTimeout;

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RabbitMQErrorResponse({
      message: RABBITMQ_CONNECT_MESSAGE.MESSAGE,
      statusCode: RABBITMQ_CONNECT_MESSAGE.CODE,
    });
  }, RABBITMQ_CONNECT_TIMEOUT);
};

const handleEventConnection = (connectionRabbitMQ) => {
  connectionRabbitMQ.on(statusConnectRabbitMQ.CONNECTED, () => {
    console.log("ConnectionRabbitMQ - Connection status: Connected");
    clearTimeout(connectionTimeout);
  });

  connectionRabbitMQ.on(statusConnectRabbitMQ.CLOSED, () => {
    console.log("ConnectionRabbitMQ - Connection status: Closed");
    handleTimeoutError();
  });

  connectionRabbitMQ.on(statusConnectRabbitMQ.ERROR, (err) => {
    console.log(`ConnectionRabbitMQ - Connection status: Error ${err}`);
    handleTimeoutError();
  });
};

const initRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:12345@localhost");
    client.connectionRabbitMQ = connection;
    handleEventConnection(connection);
  } catch (error) {
    console.error(error);
  }
};

const getRabbitMQ = () => client;

const closeRabbitMQ = () => {};

module.exports = {
  initRabbitMQ,
  getRabbitMQ,
  closeRabbitMQ,
};
