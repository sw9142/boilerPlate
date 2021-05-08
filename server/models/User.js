const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true, //sw 9142@gmail.com => sw9142@gmail.com
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt
      .genSalt()
      .then((salt) => {
        bcrypt
          .hash(user.password, salt)
          .then((encryptedPwd) => {
            user.password = encryptedPwd;
            next();
          })
          .catch((err) => {
            console.log("Err occurred when encrypting with salt" + err);
          });
      })
      .catch((err) => {
        console.log(`Error occurred when salting. ${err}`);
      });
  } else {
    next();
  }
});

userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  jwt.verify(token, "secretToken", function (err, decoded) {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      //"_id" : decoded?
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
