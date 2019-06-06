const fs = require('fs');

const extension = '.avsc';

let schemas;
let path;

function getFileName(fullName) {
  return fullName
    .split('.')
    .slice(0, -1)
    .join('.');
}

function parseschema(schemaFile) {
  const schema = JSON.parse(schemaFile);
  return schema;
}

function createschema(schemaType) {
  const files = fs.readdirSync(path);
  const availableSchemas = files
    .filter(file => file.endsWith(extension))
    .map(file => getFileName(file));

  const hasSchema = availableSchemas.includes(`${schemaType}`);
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
