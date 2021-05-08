const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const config = require("./config/key");
const UserModel = require("./models/User");
const bodyParser = require("body-parser");
dotenv.config({ path: "./config/keys.env" });

mongoose
  .connect(config.MONGOOSE_APIKEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Successfully connect to the MongoDB"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("react_john");
});

app.post("/register", (req, res) => {
  let isValidated = true;
  let messageValidation = {};
  let regEpx_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g; // retrieved from https://regexr.com/3e48o
  let regEpx_password = /^(?=.{6,12}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/g; //https://riptutorial.com/regex/example/18996/a-password-containing-at-least-1-uppercase--1-lowercase--1-digit--1-special-character-and-have-a-length-of-at-least-of-10

  const user = new UserModel();

  const { name, email, password } = req.body;
  console.log(name, email, password);

  if (typeof name !== "string" || name.length === 0) {
    console.log("okay1");
    isValidated = false;
    messageValidation.fname = "Please enter your name :)";
  } else if (email.length === 0) {
    console.log("okay2");
    isValidated = false;
    messageValidation.email = "Please enter your email :)";
  } else if (password.length === 0) {
    console.log("okay3");
    isValidated = false;
    messageValidation.password = "Please enter the password";
  } else if (!regEpx_email.test(email)) {
    console.log("okay4");
    isValidated = false;
    messageValidation.email = "Please enter your email correctly";
  } else if (!regEpx_password.test(password)) {
    console.log("okay5");
    isValidated = false;
    messageValidation.password =
      "Password must be between 6 to 12 characters and contains at least one lowercase letter, uppercase letter, number and symbol.";
  }

  if (isValidated) {
    console.log("isValidated?", isValidated);
    const User = new UserModel({
      name: name,
      email: email,
      password: password,
    });

    User.save((err, userInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({
        success: true,
      });
    });
  }
});

const HTTP_PORT = process.env.PORT;

app.listen(HTTP_PORT, () => {
  console.log("listening to the port");
});
