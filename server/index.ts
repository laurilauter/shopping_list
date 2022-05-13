const express = require("express");
const mongoose = require("mongoose"); // new
const routes = require("./routes");
const port = process.env.PORT || 5000;

// Connect to MongoDB database
mongoose
  .connect("mongodb://localhost:27017/shop_db", { useNewUrlParser: true })
  .then(() => {
    const app = express();
    app.use(express.json());
    app.use("/api", routes);

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  });

export {};
