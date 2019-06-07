const fs = require('fs');

const extension = '.avsc';
const fieldTypes = ['int', 'float', 'long', 'string', 'boolean', 'array', 'record'];

let schemas;
let path;

function parseschema(schemaFile) {
  const { fields, ...rest } = JSON.parse(schemaFile);
  const filteredFields = fields.filter(({ type }) => {
    return fieldTypes.includes(type);
  });
  return { ...rest, fields: filteredFields };
}

function createschema(schemaType) {
  const files = fs.readdirSync(path);
  const availableSchemas = files.filter(file => file.endsWith(extension));

  const hasSchema = availableSchemas.includes(`${schemaType}${extension}`);
  if (hasSchema) {
    const schemaFile = fs.readFileSync(`${path}/${schemaType}${extension}`, 'utf8');
    return parseschema(schemaFile);
  } else {
    throw new Error('No schama available!');
  }
}

function getschema(schemaType) {
  let schema = schemas[schemaType];
  if (!schema) {
    schema = createschema(schemaType);
    schemas[schemaType] = schema;
  }

  return schema;
}

function validate(schemaType, schemaDict) {}

function initilize(folderPath) {
  schemas = {};
  path = folderPath;
}

module.exports = {
  initilize,
  getschema,
  validate,
};
