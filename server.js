require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOption = require("./config/corsOption");
const connectDB = require("./config/DatabaseConn");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");

const PORT = process.env.PORT || 9999;

connectDB();

app.use(credentials);
app.use(cors(corsOption));

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`${req.url}\t${req.method}`);
  next();
});

app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use("/", require("./routes/home"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/forgotPassword", require("./routes/forgotPassword"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT);
app.use("/user", require("./routes/user"));
app.use("/chat", require("./routes/chat"));

app.use((err, req, res, next) => {
  console.log(`${err.stack}`);
  res.status(500).send(`${err.message}`);
  next();
});
mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  console.log("Connected to Database");
  module.exports = app;
});
