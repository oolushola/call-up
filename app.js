const express = require("express");
require("dotenv").config();
const DB_URL = process.env.MONGODB_URL;
const bodyParser = require("body-parser");
const db = require("./middleware/db");
const path = require("path");
const routes = require("./routes/route");
const expressIp = require("express-ip");
const app = express();
const morgan = require('morgan')
const helmet = require('helmet')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressIp().getIpInfoMiddleware);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "ssl")));
app.use(morgan('dev'))
app.use(helmet())

app.use(routes);

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  next();
});

app.use("*", (_, res, _2) => {
  res.status(404).json({
    message: "resource not found",
    status: 404,
  });
});



db.SERVER(DB_URL, app);
