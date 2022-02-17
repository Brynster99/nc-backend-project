const {
  fetchApiDocs,
  fetchUsers,
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  updateArticleById,
} = require('../models/models');

// --== Controllers ==--
exports.getApiDocs = (req, res, next) => {
  console.log('invoked getApiDocs');

  fetchApiDocs().then((docs) => {
    res.status(200).send({ docs });
  });
};

exports.getUsers = (req, res, next) => {
  console.log('invoked getUsers');

  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

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
      const articlePromises = articles.map((article) => {
        return fetchArticleById(article.article_id).then((article) => article);
      });

      Promise.all(articlePromises).then((articles) => {
        res.status(200).send({ articles });
      });
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
