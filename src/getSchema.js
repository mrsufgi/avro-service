const path = require('path');
const fs = require('fs');

const { folder_folderPath = './schemas' } = process.env;
const extension = '.avsc';
const primitiveTypes = ['int', 'float', 'long', 'string', 'boolean'];
const complexTypes = ['array', 'record'];
const fieldTypes = [...primitiveTypes, ...complexTypes];

const schemas = {};
const folderPath = path.resolve(folder_folderPath);

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
  const files = fs.readdirSync(folderPath);
  const availableSchemas = files.filter(file => file.endsWith(extension));

  const hasSchema = availableSchemas.includes(`${schemaType}${extension}`);
  if (hasSchema) {
    const schemaFile = fs.readFileSync(`${folderPath}/${schemaType}${extension}`, 'utf8');
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

module.exports = getSchema;
