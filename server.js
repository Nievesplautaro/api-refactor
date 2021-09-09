require('dotenv').config()
require('./database')

const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middlewares/notFound.js')
const handleErrors = require('./middlewares/handleErrors.js')

const usersRouter = require('./controller/users')
const notesRouter = require('./controller/notes')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Working</h1>')
})

app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)
app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }

