const ClothingItems = require('../models/clothingItem');
const {NOT_FOUND_ERROR, INVALID_DATA, SERVER_ERROR} = require('../utils/errors')

module.exports.getClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((clothingItems) => res.status(200).send({data: clothingItems}))
    .catch((err)  => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl} = req.body;

  ClothingItems.create({ name, weather, imageUrl, owner: req.user._id})
    .then((clothingItems) => res.status(201).send(clothingItems))
    .catch((err) => {
      console.error(err);
      res.status(INVALID_DATA).send({ message: err.message });
    });
}

module.exports.deleteClothingItem = (req, res) => {
  const  {itemId} =  req.params
  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({}))
    .catch((err) => {
      console.error(err);
      if(err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({message: err.message});
      }
       res.status(INVALID_DATA).send({message: err.message});
    });
}

module.exports.likeClothingItem = (req, res) => {
  console.log(req.params.itemId);
  ClothingItems.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail()
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err)
    if(err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: err.message})
    }
     res.status(INVALID_DATA).send({ message: err.message});
  });
}

module.exports.unlikeClothingItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail()
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: err.message });
    }

    res.status(SERVER_ERROR).send({ message: err.message });
  });
}

