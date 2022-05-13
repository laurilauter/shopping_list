const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: { type: String },
  amount: Number,
  author: String,
  active: Boolean,
});

module.exports = mongoose.model("Item", schema);

export {};
