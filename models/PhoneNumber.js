const mongoose = require("mongoose");

const phoneNumberSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (n) => {
        return /\d{2,3}-\d+/.test(n);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});

phoneNumberSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const PhoneNumber = mongoose.model("Phone Number", phoneNumberSchema);

const getNumbers = () => {
  return PhoneNumber.find({});
};

const countEntries = () => {
  return PhoneNumber.countDocuments({});
};

const getIndividual = (userId) => {
  return PhoneNumber.findById(userId);
};

const deleteIndividual = (userId) => {
  return PhoneNumber.findByIdAndDelete(userId);
};

const updateIndividual = (userId, number) => {
  return PhoneNumber.findByIdAndUpdate(userId, number, {
    new: true,
    runValidators: true,
    context: "query",
  });
};

module.exports = {
  PhoneNumber,
  getNumbers,
  countEntries,
  getIndividual,
  deleteIndividual,
  updateIndividual,
};
