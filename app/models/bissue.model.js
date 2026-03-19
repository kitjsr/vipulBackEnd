module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Reference to Book,
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // Reference to Student
      active: Boolean
    
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Bissue = mongoose.model("bissue", schema);
  return Bissue;
};
