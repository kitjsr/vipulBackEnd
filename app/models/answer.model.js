module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      question:  { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, // Reference to Question,
      user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User,
      answer: String,
      active: Boolean
    
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Answer = mongoose.model("answer", schema);
  return Answer;
};
