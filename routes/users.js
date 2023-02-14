const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const _ = require('lodash')
const bcrypt = require('bcrypt')
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

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  let user = await User.findOne({email: req.body.email})
  if(user) return res.status(400).send('User already exists')

  user = new User (_.pick(req.body, ['name', 'email', 'password']))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  await user.save()


  res.send(_.pick(user, ['_id', 'name', 'email']))
})

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