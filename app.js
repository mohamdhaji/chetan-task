const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const playerRoutes = require("./routes/player");
const franchiseRoutes = require("./routes/franchise");

const app = express();
app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


app.use("/player", playerRoutes);
app.use("/franchise", franchiseRoutes);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


mongoose
  .connect(
    "mongodb+srv://mohamdhaji:mohamdhaji123@cluster0.wddes.mongodb.net/testing?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));










  