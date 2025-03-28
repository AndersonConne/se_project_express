const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  weather: {
    type: String,
    enum: ["hot", "warm", "cold"],
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,

    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },

  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [],
  },

  createdAt: {
    type: Date,
    value: Date.now(),
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
