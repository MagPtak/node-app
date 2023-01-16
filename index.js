//const Joi = require('joi')
const express = require('express')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const app = express()

const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1/vidly')
  .then(() => console.log('Connected do mongodb...'))
  .catch(err => console.log('Could not connect to mongodb...', err))


app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/customers', customers )


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening o n port ${port}`))