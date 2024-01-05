require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const PhoneNumber = require("./models/PhoneNumber");

mongoose.set("strictQuery", false);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
  }
};
connect();

const getNumbers = async () => {
  try {
    const response = await PhoneNumber.find({});
    return response;
  } catch (err) {
    console.log("Could not get the numbers", err);
  }
};

const countEntries = async () => {
  try {
    const response = await PhoneNumber.countDocuments({});
    return response;
  } catch (err) {
    console.log("Could not count the entries", err);
  }
};

const getIndividual = async (userId) => {
  try {
    const response = await PhoneNumber.findById(userId);
    return response;
  } catch (err) {
    console.log("Could not get the individual number", err);
  }
};

const deleteIndividual = async (userId) => {
  try {
    await PhoneNumber.findByIdAndDelete(userId);
  } catch (err) {
    console.log("Can't delete individual", err);
  }
};

const app = express();

morgan.token("reqbody", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqbody"
  )
);

let numbers = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", async (request, response) => {
  try {
    const number = await getNumbers();
    response.json(number);
  } catch (err) {
    console.log("Error getting numbers", err);
  }
});

app.get("/info", async (request, response) => {
  try {
    const entries = await countEntries();

    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;

    response.send(
      `<p>The phonebook currently has ${entries} entries</p><p>${dateTime}</p>`
    );
  } catch (err) {
    console.log("Error getting numbers", err);
  }
});

app.get("/api/persons/:id", async (request, response) => {
  const individualId = request.params.id;

  try {
    const individual = await getIndividual(individualId);
    if (individual) {
      response.json(individual);
    } else {
      response.status(404).end();
    }
  } catch (err) {
    console.log("Error getting individual", err);
  }
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "Name missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "Number missing",
    });
  }

  const number = new PhoneNumber({
    name: body.name,
    number: body.number,
  });

  try {
    await number.save();
    response.status(201).json(number);
  } catch (err) {
    console.log("Error adding number", err);
  }
});

// Exercise 3.15
app.delete("/api/persons/:id", async (request, response) => {
  const userId = request.params.id;

  try {
    await deleteIndividual(userId);
    response.status(204).end();
  } catch (err) {
    console.log("Failed to delete", err);
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
