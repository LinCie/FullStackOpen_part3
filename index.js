const express = require("express");
const app = express();

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

app.get("/api/persons", (request, response) => {
  response.json(numbers);
});

app.get("/info", (request, response) => {
  const entries = numbers.length;

  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;

  response.send(
    `<p>The phonebook currently has ${entries} entries</p><p>${dateTime}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const userId = Number(request.params.id);
  const user = numbers.find((number) => number.id === userId);

  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const userId = Number(request.params.id);
  numbers = numbers.filter((number) => number.id !== userId);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
