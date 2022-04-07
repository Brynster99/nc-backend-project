const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const { checkExists } = require('../models/models');

// --== Hooks (Setup/Teardown) ==--
beforeEach(() => seed(testData));
afterAll(() => db.end());

// --== Tests ==--

// POSTs...
describe('POST /api/articles/:article_id/comments', () => {
  test('STATUS 201: Returns created comment obj', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({
        username: 'icellusedkars',
        body: 'did u know aye cell yous used kars',
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            author: 'icellusedkars',
            body: 'did u know aye cell yous used kars',
          })
        );
      });
  });

  test('STATUS 400: Returns error if passed username is not valid foreign key', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: 'Brynster',
        body: 'u suk',
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });

  test('STATUS 400: Returns error if article_id is not valid', () => {
    return request(app)
      .post('/api/articles/hello/comments')
      .send({
        username: 'icellusedkars',
        body: 'hello there',
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });

  test('STATUS 400: Returns error if body does not contain required data', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({ username: 'icellusedkars' })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });

  test('STATUS 400: Returns error if request body is empty', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });
});

// GETs...
describe('API-wide tests', () => {
  test('STATUS: 404, Returns error message when invalid path specified', () => {
    return request(app)
      .get('/api/invalidpath')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Path not found');
      });
  });
});

describe('GET /api', () => {
  test('STATUS: 200, Returns JSON instructions for available endpoints and usage', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: { docs } }) => {
        expect(docs).toEqual(
          expect.objectContaining({
            'POST Requests': expect.any(Object),
            'GET Requests': expect.any(Object),
            'PATCH Requests': expect.any(Object),
            'DELETE Requests': expect.any(Object),
          })
        );
      });
  });
});

describe('GET /api/users', () => {
  test('STATUS: 200, Returns an array of user objects', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        expect(typeof users).toBe('object');
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        expect(users).toEqual([
          {
            username: 'butter_bridge',
          },
          {
            username: 'icellusedkars',
          },
          {
            username: 'rogersop',
          },
          {
            username: 'lurker',
          },
        ]);
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
            article_id: expect.any(Number),
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

  test('STATUS: 200, Returned array is sorted by date_created in desc order by default', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length === 0).toBe(false);
        expect(articles).toBeSorted({ key: 'created_at', descending: true });
      });
  });

  test('STATUS: 200, Returns array for which each article object contains comment count', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0]).toEqual(
          expect.objectContaining({
            comment_count: '2',
          })
        );
      });
  });

  test('STATUS: 400, Returns error when there are invalid query values', () => {
    return request(app)
      .get('/api/articles?sort_by=invalid')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });

  test('STATUS: 400, Returns bad request if query values valid but not in greenlist', () => {
    return request(app)
      .get('/api/articles?order=notGreenlisted')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });

  test('STATUS: 404, Returns error when topic valid but does not exist', () => {
    return request(app)
      .get('/api/articles?topic=nothing')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('No topics with slug: nothing');
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

  test('STATUS: 200, Returns single article object with all columns from articles table AND comment_count', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            comment_count: '11',
          })
        );
      });
  });

  test('STATUS: 404, Returns not found if ID is valid but not found in db', () => {
    return request(app)
      .get('/api/articles/80')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('No articles with article_id: 80');
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

describe('GET /api/articles/:article_id/comments', () => {
  test('STATUS: 200, Returns array of comments for given article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments[0]).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
        expect(comments.length).toBe(11);
      });
  });

  test('STATUS: 200, Returns empty array for valid and existent article that has no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  test('STATUS: 400, Returns error bad request when given invalid article_id', () => {
    return request(app)
      .get('/api/articles/notAnArticle/comments')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });

  test('STATUS: 404, Returns error not found if article_id is valid but non-existent', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('No articles with article_id: 999');
      });
  });
});

// PATCHs...
describe('PATCH /api/articles/:article_id', () => {
  test('STATUS: 200, Returns updated object in new state', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: 50,
      })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 150,
          })
        );
      });
  });

  test('STATUS: 200, Returns updated object in new state when given negative votes', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: -50,
      })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 50,
          })
        );
      });
  });

  test('STATUS: 404, Returns not found if article_id valid but non-existent', () => {
    return request(app)
      .patch('/api/articles/99')
      .send({ inc_votes: 50 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('No articles with article_id: 99');
      });
  });

  test('STATUS: 400, Returns bad request if invalid article_id', () => {
    return request(app)
      .patch('/api/articles/invalidid')
      .send({ inc_votes: 50 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });

  test('STATUS: 400, Returns bad request if body does not contain inc_votes property', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          "Bad Request, body does not contain 'inc_votes' property"
        );
      });
  });

  test('STATUS: 400, Returns bad request if inc_votes property contains invalid value', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: 'invalidValue',
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });
});

// DELETEs...
describe('DELETE/api/comments/:comment_id', () => {
  test('STATUS: 204, Deletes comment with given ID and returns no content', () => {
    return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test('STATUS: 400, Returns error if comment_id is invalid', () => {
    return request(app)
      .delete('/api/comments/invalidId')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Bad Request');
      });
  });

  test('STATUS: 404, Returns error if comment_id is valid but non-existent', () => {
    return request(app)
      .delete('/api/comments/9001')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('No comments with comment_id: 9001');
      });
  });
});

// --== Utils Tests ==--
describe('Utils Tests', () => {
  describe('checkExists()', () => {
    test('Checks if the given value exists in the given column of given table', () => {
      return checkExists('articles', 'article_id', 418)
        .then(() => {})
        .catch((err) => {
          expect(err.msg).toBe('No articles with article_id: 418');
        });
    });

    test('Returns 400 error if given table or column are NOT in greenlists', () => {
      return checkExists('notATable', 'article_id', 2)
        .then(() => {})
        .catch((err) => {
          expect(err.status).toBe(400);
          expect(err.msg).toBe('Bad Request');
        });
    });
  });
});
