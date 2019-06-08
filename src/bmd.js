const fs = require('fs');
const { isInt, isFloat, isLong, isBool, isString } = require('./validators');
const extension = '.avsc';
const primitiveTypes = ['int', 'float', 'long', 'string', 'boolean'];
const complexTypes = ['array', 'record'];
const fieldTypes = [...primitiveTypes, ...complexTypes];

let schemas;
let path;

function parseSchema(schemaFile) {
  const { fields, ...rest } = JSON.parse(schemaFile);
  const { independed, referenced } = fields.reduce(
    (acc, field) => {
      const isIndepended = fieldTypes.includes(field.type);
      if (isIndepended) {
        acc.independed.push(field);
      } else {
        acc.referenced.push(field);
      }
      return acc;
    },
    { independed: [], referenced: [] },
  );

  const resolved = referenced.map(field => {
    const schema = getSchema(field.type);
    return {
      name: field.name,
      type: 'record',
      fields: schema.fields,
    };
  });

  // TODO: resolve schema as a record type
  return { ...rest, fields: [...independed, ...resolved] };
}

function createSchema(schemaType) {
  const files = fs.readdirSync(path);
  const availableSchemas = files.filter(file => file.endsWith(extension));

  const hasSchema = availableSchemas.includes(`${schemaType}${extension}`);
  if (hasSchema) {
    const schemaFile = fs.readFileSync(`${path}/${schemaType}${extension}`, 'utf8');
    return parseSchema(schemaFile);
  } else {
    throw new Error('No schama available!');
  }
}

function getSchema(schemaType) {
  let schema = schemas[schemaType];
  if (!schema) {
    schema = createSchema(schemaType);
    schemas[schemaType] = schema;
  }
  return schema;
}

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

// RECURSION STOP
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

function validate(schemaType, schemaDict) {
  const schama = getSchema(schemaType);
  return validateSchema(schama, schemaDict);
}

function initilize(folderPath) {
  schemas = {};
  path = folderPath;
}

module.exports = {
  initilize,
  getSchema,
  validate,
};
