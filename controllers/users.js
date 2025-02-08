const User = require('../models/user');
const {NOT_FOUND_ERROR, SERVER_ERROR, INVALID_DATA} = require('../utils/errors')

module.exports.getUsers = (req, res) => {
  console.log('IN CONTROLLER');
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.' }));
}

module.exports.createUser = (req, res) => {
  console.log("SUCESS POST");
  const { name, avatar } = req.body;
  console.log(name, avatar);
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError")  {
        return res.status(INVALID_DATA).send({message: err.message});
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
}

module.exports.getUserById = (req, res) => {
  console.log("User ID");
  const { userId } = req.params;
  console.log(userId);
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if(err.name === "DocumentNotFoundError") {
         return res.status(NOT_FOUND_ERROR).send({message: err.message})
      } if (err.name === "CastError") {
         return res.status(INVALID_DATA).send({ message: err.message });
      }
      res.status(SERVER_ERROR).send({message: 'An error has occured on the server.'});
    })
}