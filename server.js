const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();

// Set EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const userRoute = require("./routes/userRoutes");
app.use("/", userRoute);

const adminRoute = require("./routes/adminRoutes");
app.use("/admin", adminRoute);


const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

app.listen(3005, () => {
  console.log("server running on 3005");
});
