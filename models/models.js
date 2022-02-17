const db = require('../db/connection');
const fs = require('fs/promises');

// --== Models ==--
exports.fetchApiDocs = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`)
    .then((fileContent) => JSON.parse(fileContent));
};

exports.fetchUsers = () => {
  return db.query('SELECT username FROM users').then(({ rows }) => rows);
};

exports.fetchTopics = () => {
  return db.query('SELECT * FROM topics;').then(({ rows }) => rows);
};

exports.fetchArticles = () => {
  return db
    .query(
      'SELECT articles.*, COUNT(articles.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;'
    )
    .then(({ rows }) => rows);
};

exports.fetchArticleById = (articleId) => {
  return db
    .query(
      'SELECT articles.*, COUNT(articles.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;',
      [articleId]
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

exports.updateArticleById = (articleId, reqBody) => {
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
