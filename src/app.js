// src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("../config");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

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
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

/* CONFIGURE ROUTES */
config.routes.configureRoutes(app);

/* START SERVER */
config.server.startServer(app);
