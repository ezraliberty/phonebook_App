const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const Person = require('./models/phone');
require('dotenv').config();

const app = express();

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(cors());
app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(express.json());

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get('/info', (request, response) => {
  const timestamp = new Date().toString();
  const total = persons.length;
  response.send(
    `<p> Phonebook has info for ${total} people</p> <p>${timestamp} </p>`
  );
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((error) => next(error));
});

// const generateId = () => Math.random() * 1000;

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const idPerson = Person.find({}).then(
    (persons) => persons.name === body.name
  );

  if (idPerson) {
    const person = {
      name: body.name,
      number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, {
      new: true,
      runValidators: true,
      context: 'query',
    })
      .then((updatedPerson) => response.json(updatedPerson))
      .catch((error) => next(error));
  }
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
  
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening from ${PORT}`);
});
