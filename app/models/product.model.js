const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    category: String,
    brand: String,
    price: String,
    ram: Number,
    rom: Number,
    screenSize: String,
    camera: String,
    battery: String,
    processor: String,
    image: String,
    active: Boolean,
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Product = mongoose.model("Product", schema);

module.exports = Product;
