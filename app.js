const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const playerRoutes = require("./routes/player");
const franchiseRoutes = require("./routes/franchise");

require("dotenv").config();

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


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose
  .connect(
    process.env.MONGODB_URI,{ useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));










  