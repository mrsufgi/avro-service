const request = require('supertest');
const app = require('./index');
const levelExample = require('../data/example.json');

describe('GET /schema/:schemaType', () => {
  it('happy flow', done => {
    const schemaType = 'line';
    request(app)
      .get(`/schema/${schemaType}`)
      .expect(200)
      .expect(
        {
          name: 'line',
          fields: [
            {
              name: 'start',
              type: 'record',
              fields: [{ name: 'x', type: 'float' }, { name: 'y', type: 'float' }],
            },
            {
              name: 'end',
              type: 'record',
              fields: [{ name: 'x', type: 'float' }, { name: 'y', type: 'float' }],
            },
          ],
        },
        done,
      );
  });

  it('error flow', done => {
    const schemaType = 'error';
    request(app)
      .get(`/schema/${schemaType}`)
      .expect(500, done);
  });
});

describe('POST /schema/validate', () => {
  it('happy flow', done => {
    const schemaType = 'level';
    request(app)
      .post(`/schema/validate`)
      .send({ schemaType, schemaDict: levelExample })
      .expect(200)
      .expect({ isValid: true }, done);
  });
});
