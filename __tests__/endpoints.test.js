const res = require('express/lib/response');
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');

// --== Hooks (Setup/Teardown) ==--
beforeEach(() => seed(testData));
afterAll(() => db.end());

// --== Tests ==--
describe('API-wide tests', () => {
  test('STATUS: 500, Returns error if code is broken)', () => {
    return request(app)
      .get('/api/brokenpath')
      .expect(500)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Server Error');
      });
  });

  test('STATUS: 404, Returns error message when invalid path specified', () => {
    return request(app)
      .get('/api/invalidpath')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Path not found');
      });
  });
});

describe('GET /api/topics', () => {
  test('STATUS: 200, Returns an array of topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(
        ({
          body: {
            topics: [topic],
          },
        }) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        }
      );
  });
});

describe('GET /api/articles', () => {
  test('STATUS: 200, Returns an array of article objects', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0]).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });

  test('STATUS: 200, Returned array is sorted by date_created in desc order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ key: 'created_at', descending: true });
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('STATUS: 200, Returns single article object with all columns from articles table', () => {
    return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });

  test('STATUS: 404, Returns not found if ID is not found in db', () => {
    return request(app)
      .get('/api/articles/80')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('No article with ID: 80');
      });
  });

  test('STATUS: 400, Returns bad request if ID is invalid', () => {
    return request(app)
      .get('/api/articles/invalidid')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });
});
