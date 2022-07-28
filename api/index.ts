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

  /* serve your front (stored in the public folder) */
  app.use("/", express.static("./dist/public"));

  //app.use(express.static(path.join(__dirname, "dist", "public")));
  // required to serve SPA on heroku production without routing problems; it will skip only 'api' calls
  //if (process.env.NODE_ENV === "production") {
  app.get(/^((?!(api)).)*$/, (req: any, res: any) => {
    res.sendFile(path.join("./app/dist/public/index.html")); //Error: ENOENT: no such file or directory, stat '/dist/public/index.html'
    // res.sendFile(path.join(__dirname + "/../public/index.html"));
  });
  //}

  app.listen(port, () => {
    console.log(`Server running at port:${port}`);
  });
});

export {};
