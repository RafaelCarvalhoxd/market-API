const { validateField } = require('./validationUtils');

const validateName = validateField('name');
const validatePrice = validateField('price');
const validateCategoryId = validateField('category_id');

module.exports = { validateName, validatePrice, validateCategoryId };