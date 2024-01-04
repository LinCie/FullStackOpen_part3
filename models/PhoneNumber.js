const mongoose = require("mongoose");

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String,
});

phoneNumberSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phone Number", phoneNumberSchema);
