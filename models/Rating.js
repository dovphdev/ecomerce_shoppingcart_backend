const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema   

const RatingSchema = new mongoose.Schema(
  {
    star: Number,

    ratingBy: {
      type: ObjectId,
      ref: "user",
    },

    product: {
      type: ObjectId,
      ref: "product",
    },
  }
);

module.exports = Rating = mongoose.model("rating", RatingSchema);
