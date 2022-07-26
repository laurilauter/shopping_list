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

  /* serve your front (stored in the public folder) */
  app.use("/", express.static("./dist/public"));

  //app.use(express.static(path.join(__dirname, "dist", "public")));
  // required to serve SPA on heroku production without routing problems; it will skip only 'api' calls
  //if (process.env.NODE_ENV === "production") {
  app.get(/^((?!(api)).)*$/, (req: any, res: any) => {
    res.sendFile("index.html");
    //console.log("path: ", path.join(__dirname, "dist/public/index.html"));
  });
  //}

  app.listen(port, () => {
    console.log(`Server running at port:${port}`);
  });
});

export {};
