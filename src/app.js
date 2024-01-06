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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

/* CONFIGURE ROUTES */
config.routes.configureRoutes(app);

/* START SERVER */
config.server.startServer(app);
