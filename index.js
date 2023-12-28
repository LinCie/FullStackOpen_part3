const express = require("express");
const app = express();

const numbers = [
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
  console.log("test");
  const userId = Number(request.params.id);
  console.log(userId);

  const user = numbers.find((number) => number.id === userId);
  console.log(user);

  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
