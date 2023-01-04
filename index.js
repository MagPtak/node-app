const Joi = require('joi')
const express = require('express')
const app = express()
app.use(express.json())

const genres = [
  {id: 1, name: 'comedy'},
  {id: 2, name: 'thriller'},
  {id: 3, name: 'sc-fi'}
]

//
app.get('/api/genres', (req, res) => {
  res.send(genres)
})

app.get('/api/genres/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send('That genre does not exist')
  res.send(genre)
})

//
app.post('/api/genres', (req, res) => {
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  const genre = {
    id: genres.length + 1,
    name: req.body.name
  }
  genres.push(genre)
  res.send(genre)
})

//
app.put('/api/genres/:id', (req,res) => {
  //404
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send('That genre does not exist')

  //400
  const { error } = validateGenre(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //Update genre name
  genre.name = req.body.name

  //Return updated name
  res.send(genre)
})

//
app.delete('/api/genres/:id', (req, res) => {
  //404
  const genre = genres.find(g => g.id === parseInt(req.params.id))
  if (!genre) return res.status(404).send('That genre does not exist')

  //Delete
  const index = genres.indexOf(genre)
  genres.splice(index, 1)

  res.send(genre)

})

//
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(5).required()
  }
  return Joi.validate(genre, schema)
}



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening o n port ${port}`))