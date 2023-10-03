const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const Person = require("./models/phone");
require("dotenv").config();

const app = express();

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(express.json());
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
//   {
//     id: 5,
//     name: "Lord Lugard",
//     number: "39-23-56782",
//   },
// ];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/info", (request, response) => {
  const timestamp = new Date().toString();
  const total = persons.length;
  response.send(
    `<p> Phonebook has info for ${total} people</p> <p>${timestamp} </p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

// const generateId = () => Math.random() * 1000;

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (body.name.length < 1 || body.number < 1) {
    return res.status(400).json({ error: "Content Missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const idPerson = Person.find({}).then(
    (persons) => persons.name === body.name
  );

  if (idPerson) {
    const person = {
      name: body.name,
      number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then((updatedPerson) => response.json(updatedPerson))
      .catch((error) => next(error));
  }
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening from ${PORT}`);
});
