const getSchema = require('./getSchema');

const { isInt, isFloat, isLong, isBool, isString } = require('./validators');

const validators = {
  int: isInt,
  float: isFloat,
  long: isLong,
  string: isString,
  boolean: isBool,
  array: (array, validator) => {
    return Array.isArray(array) && array.reduce((acc, val) => acc && validator(val));
  },
  record: (record, validator) => {
    return validator(record);
  },
};

function getFieldByName(fields, name) {
  return fields.find(field => field.name === name);
}

function validateValue(field, value) {
  const { type, items, fields, name } = field;
  const validator = validators[type];
  const isValid = validator(value, subDict => {
    let schema;
    if (items) {
      schema = getSchema(items);
    } else {
      schema = { name, fields };
    }
    return validateSchema(schema, subDict);
  });
  return isValid;
}

async function validateSchema(schema, dictionary) {
  const { fields } = schema;
  try {
    for (const [key, value] of Object.entries(dictionary)) {
      const field = getFieldByName(fields, key);
      const isValid = await validateValue(field, value);
      if (!isValid) {
        return false;
      }
    }
    return true;
  } catch (e) {
    // eslint-disable-next-line
    console.error(e);
    return false;
  }
}

function validate(schemaType, schemaDict) {
  const schama = getSchema(schemaType);
  return validateSchema(schama, schemaDict);
}

module.exports = validate;
