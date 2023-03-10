// const winston = require('winston')
require('winston-mongodb')
// const Joi = require('joi')
// Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');
const express = require('express');
const winston = require('winston');
// const genres = require('./routes/genres')
// const customers = require('./routes/customers')
// const movies = require('./routes/movies')
// const rentals = require('./routes/rentals')
// const users = require('./routes/users')
// const auth = require('./routes/auth')
// const error = require('./middleware/error')
const app = express() 
// const config = require('config')

require('./startup/logging')
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()

// process.on('uncaughtException', (ex) => {
//   winston.error(ex.message, ex)
// })

// process.on('unhandledRejection', (ex) => {
//   winston.error(ex.message, ex)
// })

// winston.configure({transports: [new winston.transports.File({ filename: 'logfile.log' }) ]});

// const p = Promise.reject(new Error('Something failed miserably'))

// p.then(() => console.log('Done')) 

mongoose.set('strictQuery', true);

// if(!config.get('jwtPrivateKey')) {
//   console.error('FATAL ERROR: jwtPrivateKey is not defined')
//   process.exit(1)
// }

// mongoose.connect('mongodb://127.0.0.1/vidly')
//   .then(() => console.log('Connected do mongodb...'))
//   .catch(err => console.log('Could not connect to mongodb...', err))


// app.use(express.json())
// app.use('/api/genres', genres)
// app.use('/api/customers', customers )
// app.use('/api/movies', movies);
// app.use('/api/rentals', rentals);
// app.use('/api/users', users);
// app.use('/api/auth', auth);
// app.use(error)


const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening o n port ${port}`))