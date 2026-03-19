module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User,
      question: String,
      active: Boolean
    
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Question = mongoose.model("question", schema);
  return Question;
};
