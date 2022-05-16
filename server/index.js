"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose"); // new
const routes = require("./routes");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
dotenv.config();
const { MONGO_URI } = require("./config");
// Connect to MongoDB database
mongoose.connect(MONGO_URI, { useNewUrlParser: true }).then(() => {
    const app = express();
    app.use(express.json());
    app.use("/api", routes);
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
});
