const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const _CONF = require("./config");
const { startServer } = require("../server");

const app = express();
const corsOptions = {
  origin: "https://efurniture.vercel.app",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/* CONFIGURE ROUTES */
_CONF.routes.configureRoutes(app);

/* START SERVER */
startServer(app);

// Error handling middleware
app.use((req, res, next) => {
  next({
    error: {
      status: 404,
      message: "Not Found API",
    },
  });
});
app.use((error, req, res, next) => {
  res.status(error.status || 404).send({
    error: {
      status: error.status || 404,
      message: error.message || "Not Found API",
    },
  });
});

module.exports = app;
