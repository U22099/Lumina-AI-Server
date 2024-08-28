const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  chatHistory: {
    type: Array,
    default: [],
  },
  voiceHistory: {
    type: Array,
    default: [],
  },
  refreshToken: String,
  accessToken: String,
});

module.exports = mongoose.model("User", userSchema);
