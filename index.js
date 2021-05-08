const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
dotenv.config({ path: "./config/keys.env" });

mongoose
  .connect(process.env.MONGOOSE_APIKEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Successfully connect to the MongoDB"));

app.get("/", (req, res) => {
  res.send("hi");
});

const HTTP_PORT = process.env.PORT;

app.listen(HTTP_PORT, () => {
  console.log("listening to the port");
});
