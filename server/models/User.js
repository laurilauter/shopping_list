"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schema = mongoose.Schema({
    name: String,
});
module.exports = mongoose.model("User", schema);
