const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { initilize: initilzeBMD, getSchema, validate } = require('./bmd');
const app = express();
const port = 3000;

const { folder_path: folderPath = './schemas', NODE_ENV } = process.env;

// initilize service
function initilize() {
  const schemasPath = path.resolve(folderPath);
  initilzeBMD(schemasPath);

  app.use(bodyParser.json());
  app.get('/schema/:schemaType', (req, res) => {
    const { schemaType } = req.params;
    try {
      const schema = getSchema(req.params.schemaType);
      res.send(schema);
    } catch (e) {
      res.status(500);
      res.send(`Error: could not get the schema of type, ${schemaType}`);
    }
  });

  app.post('/schema/validate', (req, res) => {
    const {
      body: { schemaType, schemaDict },
    } = req;
    const result = validate(schemaType, schemaDict);
    res.send({ isValid: result });
  });

  if (NODE_ENV !== 'TEST') {
    // eslint-disable-next-line
    app.listen(port, () => console.log(`listening on port ${port}!`));
  }
}

initilize();

module.exports = app;
