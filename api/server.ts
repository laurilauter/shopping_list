import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
const path = require("path");
const routes = require("./routes");
const port = process.env.PORT;
const uri = process.env.MONGO_URI; //for live DB
const localUri = process.env.MONGO_LOCAL_URI; //for local DB

//Connect to MongoDB database
export const getConnection = mongoose.connect(`${uri}`).then(() => {
  console.log("connected to database");

  //set up a server
  const app = express();
  app.use(express.json());
  app.use("/api", routes);

  //serving public files
  app.use("/", express.static(path.join(__dirname, "../public")));

  //serv static FE
  app.get("/", (req: any, res: any) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
  });
});
