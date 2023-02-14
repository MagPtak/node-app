const mongoose = require('mongoose')
const Joi = require('joi')
const express = require('express')
const router = express.Router()
const { Customer } = require('./customers')
const { Movie } = require('./movies')
mongoose.set('strictQuery', true);

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: { 
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }      
    }),  
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
}));

router.get('/', async(req, res) => {
  const rental = await Rental.find().sort('-dateOut')
  res.send(rental)
})

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id)
  if (!rental) return res.status(404).send('That rental does not exist')
  res.send(rental)
})

//
router.post('/', async (req, res) => {
  const { error } = validateRental(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock')

  let rental = new Rental({ 
   customer: {
    _id: customer._id,
    name: customer.name,
    phone: customer.phone
   },
   movie: {
    _id: movie._id,
    title: movie.title,
    dailyRentalRate: movie.dailyRentalRate
   }
  });

  try {
    rental = await rental.save();
    movie.numberInStock--;
    movie.save()
  } catch(ex) {
    res.status(500).send('Something failed.')
  }
});

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  }
  return Joi.validate(rental, schema)
}

module.exports = router
module.exports.Rental = Rental



