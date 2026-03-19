// models/order.model.js

module.exports = mongoose => {
  const ProductDetailsSchema = new mongoose.Schema({
    productName: String,
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    productPrice: Number,
    productGender: String,
    productOccasion: String,
    productDiscount: Number,
    productMaterial: String,
    productDescription: String,
    images: [String],
    active: Boolean
  }, { _id: false });

  const OrderProductSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },

    // snapshot of product at time of order
    productDetails: ProductDetailsSchema
  });

  const schema = mongoose.Schema(
    {
      addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      // must be "products" to match your JSON
      products: [OrderProductSchema],

      totalAmount: {
        type: Number,
        required: true
      },

      status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Ssorder = mongoose.model("ssorder", schema);
  return Ssorder;
};
