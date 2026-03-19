module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      id: String,
      answer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }, // Reference to Answer,
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User,
      comment: String,
      active: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Comment = mongoose.model("comment", schema);
  return Comment;
};
