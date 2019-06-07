const request = require('supertest');
const app = require('./index');

describe('GET /schema/:schemaType', () => {
  it('happy flow', done => {
    const schemaType = 'line';
    request(app)
      .get(`/schema/${schemaType}`)
      .expect(200, done);
  });

  it('error flow', done => {
    const schemaType = 'error';
    request(app)
      .get(`/schema/${schemaType}`)
      .expect(500, done);
  });
});
