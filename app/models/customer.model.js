// import { Types } from "mongoose";
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
        cname:String,
        mobile:String,
        email:String,
        dob: String,
        gender: String,
        caddress:String,
        cpassword:String,
        status: Boolean,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Customer= mongoose.model("customer", schema);
  return Customer;
};
