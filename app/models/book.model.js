module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      isbn: String,
      title: String,
      publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' }, // Reference to Publisher,
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Reference to Publisher,
      price: Number,
      edition: Number,
      author: String,
      active: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Book = mongoose.model("book", schema);
  return Book;
};
