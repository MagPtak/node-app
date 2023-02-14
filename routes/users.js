const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Joi = require('joi')
mongoose.set('strictQuery', true);


const User = mongoose.model("User", new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  }
}))

// router.post('/', async(req, res) => {
//   const users = await Genre.find().sort('name')
//   res.send(users)
// })

// router.get('/:id', async (req, res) => {
//   const genre = await Genre.findById(req.params.id)
//   if (!genre) return res.status(404).send('That genre does not exist')
//   res.send(genre)
// })

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  let user = await User.findOne({email: req.body.email})
  if(user) return res.status(400).send('User already exists')

  user = new User ({
    name:req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  await user.save()

  res.send(user)
})

// router.put('/:id', async (req,res) => {
//   const { error } = validateGenre(req.body)
//   if (error) return res.status(400).send(error.details[0].message)

//   const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name},{
//     new: true 
//   })

//   if (!genre) return res.status(404).send('That genre does not exist')

//   res.send(genre)
// })

// router.delete('/:id', async (req, res) => {
//   const genre = await Genre.findByIdAndRemove(req.params.id)

//   if (!genre) return res.status(404).send('That genre does not exist')

//   res.send(genre)

// })

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  }
  return Joi.validate(user, schema)
}

module.exports = router
module.exports.User = User