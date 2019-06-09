const getSchema = require('./getSchema');

const { isInt, isFloat, isLong, isBool, isString } = require('./validators');
const primitiveTypes = ['int', 'float', 'long', 'string', 'boolean'];

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

function validateComplexValue(field, value) {
  const { type, items, fields, name } = field;
  const complexValidator = validators[type];
  const isValid = complexValidator(value, val => {
    let schema;
    if (items) {
      schema = getSchema(items);
    } else {
      schema = { name, fields };
    }
    return validateSchema(schema, val);
  });
  return isValid;
}

function validateValue(field, value) {
  const isPrimitive = primitiveTypes.includes(field.type);
  return isPrimitive ? validators[field.type](value) : validateComplexValue(field, value);
}

function validateSchema(schema, dictionary) {
  const { fields } = schema;
  try {
    for (const [key, value] of Object.entries(dictionary)) {
      const field = getFieldByName(fields, key);
      const isValid = validateValue(field, value);
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

module.exports = validateSchema;
