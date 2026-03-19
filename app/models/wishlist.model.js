module.exports = mongoose => {
  const Wishlist = mongoose.model(
    "wishlist",
    mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        status: {
          type: Boolean,
          default: true
        }
      },
      { timestamps: true }
    )
  );

  return Wishlist;
};
