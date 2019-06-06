const request = require('supertest');
const app = require('./index');

describe('GET /schema/:schemaType', () => {
  it.only('happy flow', done => {
    const schemaType = 'point';
    request(app)
      .get(`/schema/${schemaType}`)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });

  it('error flow', done => {
    const schemaType = 'error';
    request(app)
      .get(`/schema/${schemaType}`)
      .expect(200)
      .end(err => {
        if (err) return done(err);
        done();
      });
  });
});
