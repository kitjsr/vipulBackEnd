// import { Types } from "mongoose";
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      // _id: new Types.ObjectId(), 
      qname: String,
      ename: String,
      photo: String,
      username:String,
      status: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Qpaper= mongoose.model("qpaper", schema);
  return Qpaper;
};
