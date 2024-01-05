// src/app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("../config");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

/* CONFIGURE ROUTES */
config.routes.configureRoutes(app);

/* START SERVER */
config.server.startServer(app);
