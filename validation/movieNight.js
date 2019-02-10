const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateMovieNightInput(data) {
  let errors = {};

  data.host = !isEmpty(data.host) ? data.host : '';

  if(!Validator.isLength(data.host, { min: 2, max: 40 })) {
      errors.host = 'Host needs to be between 2 and 40 charachters'
  }

  if(Validator.isEmpty(data.host)) {
      errors.host = 'Host is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};