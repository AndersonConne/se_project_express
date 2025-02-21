const ClothingItems = require('../models/clothingItem');
const {NOT_FOUND_ERROR, INVALID_DATA, SERVER_ERROR, FORBIDDEN_ERROR} = require('../utils/errors')

module.exports.getClothingItems = (req, res) => {
  ClothingItems.find({})
    .then((clothingItems) => res.status(200).send({data: clothingItems}))
    .catch(()  => res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server' }));
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl} = req.body;

  ClothingItems.create({ name, weather, imageUrl, owner: req.user._id})
    .then((clothingItems) => res.status(201).send(clothingItems))
    .catch((err) => {
      if (err.name === 'ValidationError') {
         return res.status(INVALID_DATA).send({ message: err.message });
      }

      res.status(SERVER_ERROR).send({ message: err.message })

    });
}

module.exports.deleteClothingItem = (req, res) => {
  const {itemId} =  req.params;
  ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      if(String(item.owner) !== req.user._id) {
      return res.status(FORBIDDEN_ERROR).send({ message: "Not Authorized"});
      }
      return item.deleteOne()
        .then(()  => {
          res.send({message: "Successfully deleted", itemId});
        })
  })
    .catch((err) => {
      console.error(err);
      if(err.name === "DocumentNotFoundError") {
         return res.status(NOT_FOUND_ERROR).send({message: err.message});
      } if(err.name === 'CastError') {
        return res.status(INVALID_DATA).send({message: err.message});
      }
       return res.status(SERVER_ERROR).send({ message: "An error occurred on the server"});
    });
}

module.exports.likeClothingItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail()
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    if(err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: err.message})
    } if(err.name === 'CastError') {
       return res.status(INVALID_DATA).send({ message: err.message});
    }

    res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.'});
  });
}

module.exports.unlikeClothingItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail()
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND_ERROR).send({ message: err.message });
    } if (err.name === 'CastError') {
     return res.status(INVALID_DATA).send({message: err.message})
    }

    res.status(SERVER_ERROR).send({ message: 'An error has occurred on the server.'});
  });
}

