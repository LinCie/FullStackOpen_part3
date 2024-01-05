require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const {
  PhoneNumber,
  getNumbers,
  countEntries,
  getIndividual,
  deleteIndividual,
  updateIndividual,
} = require("./models/PhoneNumber");

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

// Get the whole numbers
app.get("/api/persons", async (request, response, next) => {
  try {
    const number = await getNumbers();
    response.json(number);
  } catch (err) {
    next(err);
  }
});

// Get the numbers of entires and the access date
app.get("/info", async (request, response, next) => {
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
    next(err);
  }
});

// Get individual number
app.get("/api/persons/:id", async (request, response, next) => {
  const individualId = request.params.id;

  try {
    const individual = await getIndividual(individualId);
    if (individual) {
      response.json(individual);
    } else {
      response.status(404).end();
    }
  } catch (err) {
    next(err);
  }
});

// Add new number
app.post("/api/persons", async (request, response, next) => {
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
    next(err);
  }
});

// Update number
app.put("/api/persons/:id", async (request, response, next) => {
  const individualId = request.params.id;
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

  const number = {
    name: body.name,
    number: body.number,
  };

  try {
    const newNumber = await updateIndividual(individualId, number);
    response.status(201).json(newNumber);
  } catch (err) {
    next(err);
  }
});

// Delete selected number
app.delete("/api/persons/:id", async (request, response, next) => {
  const userId = request.params.id;

  try {
    await deleteIndividual(userId);
    response.status(204).end();
  } catch (err) {
    next(err);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
