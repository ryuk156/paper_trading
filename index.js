const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//env init
dotenv.config();

//import routes
const authRoute = require("./routes/auth");
const homeRoute = require("./routes/home");

//connect db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connect db")
);

//Middleware
app.use(express.json());
app.use(cookieParser());

//Route middleware
app.use("/api/user", authRoute);
app.use("/api/user", homeRoute);

//server running
app.listen(4000, () => console.log("Server Running"));
