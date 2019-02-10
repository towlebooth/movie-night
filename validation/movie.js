const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateMovieInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';

  if(!Validator.isLength(data.title, { min: 1, max: 40 })) {
      errors.title = 'Title needs to be between 1 and 40 charachters'
  }

  if(Validator.isEmpty(data.title)) {
      errors.title = 'Movie title is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};