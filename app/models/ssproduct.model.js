const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productName: String,
    productCategory: String,
    productPrice: Number,
    productGender: String,
    productOccasion: String,
    productDiscount: Number,
    productMaterial: String,
    productDescription: String,
    images: [String],
    active: Boolean,
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Ssproduct = mongoose.model("Ssproduct", schema);

module.exports = Ssproduct;
