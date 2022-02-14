const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');

beforeEach(() => seed(testData));

afterAll(() => db.end());

// Start of Tests
describe('GET - /api/topics', () => {
  test('returns array of topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: topics }) => {
        expect(topics[0]).toEqual(
          expect.objectContaining({
            description: expect.any(String),
            slug: expect.any(String),
          })
        );
      });
  });

  test('returns 404 error message when given invalid path', () => {
    return request(app)
      .get('/api/invalidpath')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Path not found');
      });
  });
});
