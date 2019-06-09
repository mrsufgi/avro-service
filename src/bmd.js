const getSchema = require('./getSchema');
const validateSchema = require('./validateSchema');

function validate(schemaType, schemaDict) {
  const schama = getSchema(schemaType);
  return validateSchema(schama, schemaDict);
}

module.exports = {
  getSchema,
  validate,
};
