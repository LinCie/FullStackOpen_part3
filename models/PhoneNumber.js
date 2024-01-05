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

const PhoneNumber = mongoose.model("Phone Number", phoneNumberSchema);

const getNumbers = async () => {
  try {
    const response = await PhoneNumber.find({});
    return response;
  } catch (err) {
    throw err;
  }
};

const countEntries = async () => {
  try {
    const response = await PhoneNumber.countDocuments({});
    return response;
  } catch (err) {
    throw err;
  }
};

const getIndividual = async (userId) => {
  try {
    const response = await PhoneNumber.findById(userId);
    return response;
  } catch (err) {
    throw err;
  }
};

const deleteIndividual = async (userId) => {
  try {
    await PhoneNumber.findByIdAndDelete(userId);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  PhoneNumber,
  getNumbers,
  countEntries,
  getIndividual,
  deleteIndividual,
};
