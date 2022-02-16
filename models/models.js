const db = require('../db/connection');

// --== Models ==--
exports.fetchTopics = () => {
  console.log('invoked fetchTopics');
  return db.query('SELECT * FROM topics;').then(({ rows }) => rows);
};

exports.fetchArticles = () => {
  console.log('invoked fetchArticles');
  return db
    .query('SELECT * FROM articles ORDER BY created_at DESC;')
    .then(({ rows }) => rows);
};

exports.fetchArticleById = (articleId) => {
  console.log('invoked fetchArticleById');
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article with ID: ${articleId}`,
        });
      } else {
        return rows[0];
      }
    });
};

exports.updateArticleById = (articleId, reqBody) => {
  console.log('invoked patchArticleById');

  if (!reqBody.hasOwnProperty('inc_votes'))
    return Promise.reject({
      status: 400,
      msg: "Bad Request, body does not contain 'inc_votes' property",
    });

  return db
    .query(
      'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',
      [reqBody.inc_votes, articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No article with ID: ${articleId}`,
        });
      } else {
        return rows[0];
      }
    });
};
