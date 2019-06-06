const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { initilize: initilzeBMD, getschema, validate } = require('./bmd');
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
      const schema = getschema(req.params.schemaType);
      res.send(schema);
    } catch (e) {
      console.error(e.stack);
      res.status(500);
      res.send(`Error: could not get the schema of type, ${schemaType}`);
    }
  });

  app.post('/schema/validate', (req, res) => {
    const {
      body: { schemaType, schemaDict },
    } = req;
    const result = validate(schemaType, schemaDict);
    res.send(result);
  });

  if (NODE_ENV !== 'TEST') {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  }
}

initilize();

module.exports = app;
