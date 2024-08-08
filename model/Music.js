const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const musicSchema = new Schema({
  date: {
    type: String,
    default: Date.now,
  },
  artist: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  uploader: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Music", musicSchema);
