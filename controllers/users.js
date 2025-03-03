const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  NOT_FOUND_ERROR,
  SERVER_ERROR,
  INVALID_DATA,
  AUTHORIZATION_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email) {
    return res
      .status(INVALID_DATA)
      .send({ message: "Email or Password required!" });
  }

  return User.findOne({ email })
    .then((matched) => {
      if (matched) {
        const err = new Error("The email already exists!");
        err.code = 11000;
        throw err;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      console.error(err.message);
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: err.message });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).send({ message: err.message });
      }

      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  console.log("User ID");
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: err.message });
      }
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server." });
    });
};

module.exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(INVALID_DATA)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ email, password, token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(AUTHORIZATION_ERROR)
          .send({ message: "Incorrect email or password!" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true, upsert: true }
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: err.message });
      }

      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: err.message });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};
