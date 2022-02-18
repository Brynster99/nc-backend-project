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
  const promises = [
    fetchArticles(req.query.sort_by, req.query.order, req.query.topic),
  ];

  if (req.query.topic) {
    promises.push(checkExists('topics', 'slug', req.query.topic));
  }

  Promise.all(promises)
    .then(([articles]) => {
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
  Promise.all([
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
removeCommentById(req.params.comment_id).
then(() => res.status(204).send({}))
    .catch(next);
};
