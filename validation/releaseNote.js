const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateReleaseNoteInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';

  if(!Validator.isLength(data.title, { min: 2, max: 40 })) {
      errors.host = 'Title needs to be between 2 and 40 charachters'
  }

  if(Validator.isEmpty(data.title)) {
      errors.host = 'Title is required';
  }

  if(Validator.isEmpty(data.date)) {
      errors.host = 'Date is required';
  }

  if(Validator.isEmpty(data.notes)) {
      errors.host = 'Date is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};