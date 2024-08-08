require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOption = require("./config/corsOption");
const connectDB = require("./config/DatabaseConn");
const logEvent = require("./middleware/logsEvent");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");

const PORT = process.env.PORT || 7700;

connectDB();

app.use(credentials);
app.use(cors(corsOption));

app.use((req, res, next) => {
  console.log(`${req.method}\t${req.path}`);
  logEvent(req.method, req.url, req.path);
  next();
});
app.use(express.urlencoded({ extended: false }));

app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use("/", require("./routes/home"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/forgotPassword", require("./routes/forgotPassword"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/musicapi", require("./routes/api/musicApi"));
app.use(verifyJWT);
app.use("/user", require("./routes/user"));

app.use((err, req, res, next) => {
  console.log(`${err.stack}`);
  res.status(500).send(`${err.message}`);
  logEvent(req.method, req.url, req.path);
  next();
});
mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  console.log("Connected to Database");
  module.exports = app;
});
