const express = require("express");
const mongoose = require("mongoose"); // new
const routes = require("./routes");
const dotenv = require("dotenv");
var path = require("path");
const port = process.env.PORT || 5000;

dotenv.config();
const { MONGO_URI } = require("./config");

// Connect to MongoDB database
mongoose.connect(MONGO_URI, { useNewUrlParser: true }).then(() => {
  const app = express();
  app.use(express.json());
  app.use("/api", routes);

  //serving public files
  app.use("/", express.static(path.join(__dirname, "../public")));

  //serving the frontend on URL root
  app.get(/^((?!(api)).)*$/, (req: any, res: any) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
  });
});

export {};
