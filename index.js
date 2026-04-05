require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', function getBody (req) {
  if (req.method !== 'POST' && req.method !== 'PUT') return ''
  return JSON.stringify({ "name": req.body?.name, "number": req.body?.number})
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

const PORT = process.env.PORT
let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
// needs update
app.get("/api/info", (request, response) => (
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
))

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => {
    person
      ? response.json(person)
      : response.status(404).end()
  })
})
// needs update
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const newPersons = persons.filter(person => person.id !== id)

  if (newPersons.length === persons.length) {
    return response.status(404).end()
  }
  persons = newPersons
  return response.status(201).json(persons)
})

app.post("/api/persons",  (request, response) => {
  const name = request.body.name
  const number = request.body.number
  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
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

// needs update
app.put("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const { name, number } = request.body
  const index = persons.findIndex(p => p.id === id)
  if (index === -1) {
    return response.status(404).json({ error: "Person not found" })
  }
  const updatedPerson = {
    ...persons[index],
    name,
    number
  }
  persons[index] = updatedPerson
  response.json(updatedPerson)
})


app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`)
})
