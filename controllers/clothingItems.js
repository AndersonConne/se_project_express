const ClothingItems = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/NotFoundError");

module.exports.getClothingItems = (req, res, next) => {
  ClothingItems.find({})
    .then((clothingItems) => res.send({ data: clothingItems }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItems.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItems) => res.status(201).send(clothingItems))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return next(new ForbiddenError("You are not Authorized"));
      }
      return item.deleteOne().then(() => {
        res.send({ message: "Successfully deleted", itemId });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Request was not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Format is invalid"));
      } else {
        next(err);
      }
    });
};

module.exports.likeClothingItem = (req, res, next) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Request was not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Format is invalid"));
      } else {
        next(err);
      }
    });
};

module.exports.unlikeClothingItem = (req, res, next) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Request was not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Format is invalid"));
      } else {
        next(err);
      }
    });
};
