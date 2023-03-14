const winston = require('winston')
require('winston-mongodb')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');
const express = require('express')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')
const error = require('./middleware/error')
const app = express() 
const config = require('config')

process.on('uncaughtException', (ex) => {
  console.log('WE GOT AN UNCAUGHT EX')
  winston.error(ex.message, ex)
})

winston.configure({transports: [new winston.transports.File({ filename: 'logfile.log' }) ]});

throw new Error('Something failed during startup.')


mongoose.set('strictQuery', true);

if(!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined')
  process.exit(1)
}

mongoose.connect('mongodb://127.0.0.1/vidly')
  .then(() => console.log('Connected do mongodb...'))
  .catch(err => console.log('Could not connect to mongodb...', err))


app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/customers', customers )
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error)


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening o n port ${port}`))