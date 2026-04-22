module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      id: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name:String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      district: String,
      state: String,
      pin: Number,
      mobile: Number,
      email:String,
      addressType:String,
      active: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Address = mongoose.model("address", schema);
  return Address;
};
