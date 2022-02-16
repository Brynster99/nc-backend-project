const db = require('../db/connection');

// --== Models ==--
exports.fetchUsers = () => {
  console.log('invoked fetchUsers');

  return db.query('SELECT username FROM users').then(({ rows }) => rows);
};

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

exports.updateArticleById = (articleId, votes) => {
  console.log('invoked patchArticleById');

  return db
    .query(
      'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',
      [votes, articleId]
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
