require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', function getBody (req) {
  if (req.method !== 'POST' && req.method !== 'PUT') return ''
  return JSON.stringify({ "name": req.body?.name, "number": req.body?.number})
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


app.get("/api/persons", (request, response, next) => {
  Person.find({})
  .then(persons => response.json(persons))
  .catch(error => next(error))
})

app.get("/api/info", (request, response) => {
  Person.countDocuments({})
    .then(count => {
      response.send(`<p>Phonebook has info for ${count} people</p> <p>${new Date()}</p>`)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result =>
        response.status(204).end()
    )
    .catch(error => next(error))
})

app.post("/api/persons",  (request, response) => {
  const name = request.body.name
  const number = request.body.number
  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
//   remider to check and handle name is uniqe later
//   if (persons.find(person => person.name.toLowerCase() === name.toLowerCase())) {
//     return response.status(400).json({ error: 'name must be unique' })
//   }
  const person = new Person({
    name,
    number,
  })
  person.save().then(savedPerson => {
    console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
    response.json(savedPerson)
  })
})

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).send({ error: "person not found"})
      }
      person.name = name
      person.number = number
      return person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.message === "Cast Error") {
    return (response.status(400).send({ error: "malformatted id"}))
  }
  next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
