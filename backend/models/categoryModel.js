const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const Category = mongoose.model("categorySchema", categorySchema);

module.exports = Category;
