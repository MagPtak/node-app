const express = require('express')
const admin = require('../middleware/admin')
const router = express.Router()
const mongoose = require('mongoose')
const asyncMiddleware = require('../middleware/async')
const Joi = require('joi')
const auth = require('../middleware/auth')
mongoose.set('strictQuery', true);

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
})

const Genre = mongoose.model("Genre", genreSchema)


router.get('/', asyncMiddleware(async(req, res) => {
  throw new Error('Could not get the genres');
  const genres = await Genre.find().sort('name')
  res.send(genres) 
}))

router.get('/:id', asyncMiddleware(async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  if (!genre) return res.status(404).send('That genre does not exist')
  res.send(genre)
}))

router.post('/', auth, asyncMiddleware(async (req, res) => {
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  const genre = new Genre({ name: req.body.name })
  await genre.save()
  res.send(genre)
}))

router.put('/:id', asyncMiddleware(async (req,res) => {
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name},{
    new: true 
  })

  if (!genre) return res.status(404).send('That genre does not exist')

  res.send(genre)
}))

router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)

  if (!genre) return res.status(404).send('That genre does not exist')

  res.send(genre)

}))

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(genre, schema)
}

module.exports = router
module.exports.genreSchema = genreSchema
module.exports.Genre = Genre