const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phone = process.argv[4];

const url = `mongodb+srv://FullStackOpen:${password}@fullstackopen.ueewslx.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PhoneNumber = mongoose.model("Phone Number", phoneNumberSchema);

const phoneNumber = new PhoneNumber({
  name: name,
  number: phone,
});

const connect = async () => {
  try {
    await mongoose.connect(url);
  } catch (err) {
    console.log(err);
  }
};
connect();

const postNumber = async () => {
  try {
    await phoneNumber.save();
    console.log(`added ${name} number ${phone} to phonebook`);
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

const getNumbers = async () => {
  try {
    const response = await PhoneNumber.find({});
    response.forEach((number) => {
      console.log(number);
    });
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
};

if (process.argv.length === 3) {
  getNumbers();
} else {
  postNumber();
}
