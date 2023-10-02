const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser")
const cors = require("cors");
require("dotenv");

const app = express();

app.use(express.static("dist"));
app.use(bodyParser.json())
app.use(express.json());
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(cors());

let persons = [
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
  {
    id: 5,
    name: "Lord Lugard",
    number: "39-23-56782",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const timestamp = new Date().toString();
  const total = persons.length;
  response.send(
    `<p> Phonebook has info for ${total} people</p> <p>${timestamp} </p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => Math.random() * 1000;

app.post("/api/persons", (req, res) => {
  const body = req.body;

  const check = persons.find((person) => person.name === body.name);

  if (check) {
    return res.status(400).json({ error: "Name Must be Unique" });
  } else if (!body.name || !body.number) {
    return res.status(400).json({ error: "Kindly Add Name or Number" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.send(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening from ${PORT}`);
});
