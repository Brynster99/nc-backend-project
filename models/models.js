const db = require('../db/connection');
const fs = require('fs/promises');

// --== Models ==--

// CREATEs...
exports.insertCommentById = (articleId, username, commentBody) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
  VALUES($1, $2, $3)
  RETURNING *;`,
      [articleId, username, commentBody]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

// READs...
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

exports.fetchArticles = (sortBy = 'created_at', order = 'DESC', topic) => {
  const allowedValues = {
    sortBy: [
      'article_id',
      'title',
      'topic',
      'author',
      'body',
      'created_at',
      'votes',
      'comment_count',
    ],
    order: ['ASC', 'DESC'],
  };

  if (
    !allowedValues.sortBy.includes(sortBy) ||
    !allowedValues.order.includes(order)
  ) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  let queryStr = `SELECT articles.*, COUNT(articles.article_id) as comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const options = [];

  if (topic) {
    queryStr += ' WHERE articles.topic = $1';
    options.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;

  return db.query(queryStr, options).then(({ rows }) => rows);
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
          msg: `No articles with article_id: ${articleId}`,
        });
      } else {
        return rows[0];
      }
    });
};

exports.fetchArticleComments = (articleId) => {
  return db
    .query(
      'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC',
      [articleId]
    )
    .then(({ rows }) => rows);
};

// UPDATEs...
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
          msg: `No articles with article_id: ${articleId}`,
        });
      } else {
        return rows[0];
      }
    });
};

// DELETEs...
exports.removeCommentById = (commentId) => {
  return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [
    commentId,
  ]);
};

// --== Utils ==--
exports.checkExists = (table, column, value) => {
  const validTables = ['articles', 'topics', 'users', 'comments'];
  const validColumns = [
    'article_id',
    'topic_id',
    'slug',
    'user_id',
    'username',
    'comment_id',
  ];

  if (!validTables.includes(table) || !validColumns.includes(column))
    return Promise.reject({ status: 400, msg: 'Bad Request' });

  return db
    .query(`SELECT * FROM ${table} WHERE ${column} = $1`, [value])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          msg: `No ${table} with ${column}: ${value}`,
        });
    });
};
