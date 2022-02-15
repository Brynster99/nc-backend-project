const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
} = require('../models/models');

// --== Controllers ==--
exports.getBrokenPath = (req, res, next) => {
  console.log('invoked getBrokenPath');
  return invokeNothing();
};

exports.getTopics = (req, res, next) => {
  console.log('invoked getTopics');
  fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  console.log('invoked getArticleById');
  fetchArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
