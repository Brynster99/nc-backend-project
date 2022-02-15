const db = require('../db/connection');

// --== Models ==--
exports.fetchTopics = () => {
  console.log('invoked fetchTopics');
  return db.query('select * from topics').then(({ rows }) => rows);
};

exports.fetchArticleById = (articleId) => {
  console.log('invoked fetchArticleById');
  return db
    .query('select * from articles where article_id = $1', [articleId])
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
