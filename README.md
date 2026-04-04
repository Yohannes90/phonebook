# 📞 Phonebook API

A simple RESTful phonebook backend built with Express, deployed on Render with an integrated frontend.

## 🚀 Live Application

* 🌐 Frontend: https://phonebook-diph.onrender.com/
* 🔗 API: https://phonebook-diph.onrender.com/api/persons

## ⚙️ Run Locally

1. Clone the repository

```bash
git clone https://github.com/Yohannes90/phonebook.git
cd phonebook
```

2. Install dependencies

```bash
npm install
```

3. Start the server

```bash
npm start
```

Server runs on:

```
http://localhost:3001
```

---

## 📡 API Endpoints

### 🔹 Get all persons

```
GET /api/persons
```

Returns all contacts.

---

### 🔹 Get a single person

```
GET /api/persons/:id
```

Example:

```
GET /api/persons/1
```

---

### 🔹 Get app info

```
GET /api/info
```

Returns total number of contacts and current time.

---

### 🔹 Add a new person

```
POST /api/persons
```

#### Request body:

```json
{
  "name": "John Doe",
  "number": "123-456"
}
```

#### Responses:

* `201 Created` → returns created person
* `400 Bad Request` → missing fields or duplicate name

---

### 🔹 Update a person

```
PUT /api/persons/:id
```

#### Request body:

```json
{
  "name": "John Doe",
  "number": "999-999"
}
```

---

### 🔹 Delete a person

```
DELETE /api/persons/:id
```

#### Responses:

* `204 No Content` → success
* `404 Not Found` → person not found

---

## 🛠 Tech Stack

* Node.js
* Express
* React.js

---

## 📂 Project Structure

```
.
├── dist/            # frontend build (served by backend)
├── index.js
├── package.json
├── package-lock.json
├── README.md
└── requests.rest
```

---

✨ Full-stack app: backend + frontend served from a single deployment.
