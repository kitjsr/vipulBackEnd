module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      name: String,
      mobile: String,
      email: String,
      address: String,
      active: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Publisher = mongoose.model("Publisher", schema);
  return Publisher;
};
