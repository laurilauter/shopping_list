const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: { type: String },
  active: { type: Boolean },
});

module.exports = mongoose.model("Item", schema);

export {};
