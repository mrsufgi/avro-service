const express = require('express');
const { NODE_ENV } = process.env;
const bodyParser = require('body-parser');

const { getSchema, validate } = require('./bmd');
const app = express();
const port = 3000;

// initilize service
function initilize() {
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

  app.post('/schema/validate', async (req, res) => {
    const {
      body: { schemaType, schemaDict },
    } = req;
    const result = await validate(schemaType, schemaDict);
    res.send({ isValid: result });
  });

  if (NODE_ENV !== 'TEST') {
    // eslint-disable-next-line
    app.listen(port, () => console.log(`listening on port ${port}!`));
  }
}

initilize();

module.exports = app;
