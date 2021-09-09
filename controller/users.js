const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) => {
    try{
      const users = await User.find({}).populate('notes', {
        content: 1,
        date: 1
      })
      response.json(users)
    }catch(err){
      next(err)
    }
  })
  
  usersRouter.post('/', async (request, response) => {
    const { body } = request
    const { username, name, password } = body
  
    try{
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
    
      const user = new User({
        username,
        name,
        passwordHash
      })
    
      const savedUser = await user.save()
      response.status(201).json(savedUser)

    }catch(err){
      next(err);
    }
  })

  usersRouter.delete('/:id', async (request, response, next) => {
    const { id } = request.params
    const res =  await User.findByIdAndRemove(id);

    if (res === null) return response.sendStatus(404)
    response.status(204).end()
  })

  usersRouter.put('/:id', async (request, response, next) => {
    const { id } = request.params
    const {password,name} = request.body;

    const toUpdate = {};

    try{

      if(password){
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        toUpdate.password = passwordHash;
      }
  
      if(name) toUpdate.name = name;

      const updateUser = await User.findByIdAndUpdate(id, toUpdate, { new: true })

      if(updateUser === null) return response.status(400).end()

      response.status(202).json(updateUser)

    } catch(err){
      next(err)
    }
  })
  
  
  module.exports = usersRouter