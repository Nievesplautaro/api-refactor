const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id)
    .then(note => {
      if (note) return response.json(note)
      response.status(404).end()
    })
    .catch(err => next(err))
})

notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(next)
})

notesRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params
  // const note = await Note.findById(id)
  // if (!note) return response.sendStatus(404)
  try {
    const res = await Note.findByIdAndDelete(id)
    if (res === null) return response.sendStatus(404)
    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

notesRouter.post('/', async (request, response, next) => {
  const {
    content,
    important = false
  } = request.body

  // sacar userId de request
  const { userId } = request.body

  try {
    const user = await User.findById(userId)

    if(user === null){
      return response.status(400).json({
        error: 'required "User" field is missing'
      })
    }

    if (!content) {
      return response.status(400).json({
        error: 'required "content" field is missing'
      })
    }

    const newNote = new Note({
      content,
      date: new Date(),
      important,
      user: user._id
    })


    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter;