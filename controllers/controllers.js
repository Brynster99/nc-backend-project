const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  updateArticleById,
} = require('../models/models');

// --== Controllers ==--
exports.getTopics = (req, res, next) => {
  console.log('invoked getTopics');

  fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  console.log('invoked getArticles');

  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  console.log('invoked getArticleById');

  fetchArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  console.log('invoked patchArticleById');

  updateArticleById(req.params.article_id, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
