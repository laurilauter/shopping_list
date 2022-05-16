"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schema = mongoose.Schema({
    name: { type: String },
    amount: { type: String },
    active: { type: Boolean },
});
module.exports = mongoose.model("Item", schema);
