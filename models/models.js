const db = require('../db/connection');

exports.fetchTopics = () => {
  return db.query('select * from topics').then(({ rows }) => rows);
};
