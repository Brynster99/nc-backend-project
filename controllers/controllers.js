const {
  fetchApiDocs,
  fetchUsers,
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchArticleComments,
  updateArticleById,
  removeCommentById,
  checkExists,
} = require('../models/models');

// --== Controllers ==--

// GETs...
exports.getApiDocs = (req, res, next) => {
  fetchApiDocs().then((docs) => {
    res.status(200).send({ docs });
  });
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => res.status(200).send({ topics }))
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  return Promise.all([
    fetchArticleComments(req.params.article_id),
    checkExists('articles', 'article_id', req.params.article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

// PATCHs...
exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params.article_id, req.body)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

// DELETEs...
exports.deleteCommentById = (req, res, next) => {
  return checkExists('comments', 'comment_id', req.params.comment_id)
    .then(() => removeCommentById(req.params.comment_id))
    .then(() => res.status(204).send({}))
    .catch(next);
};
