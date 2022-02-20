const express = require('express');
const { customErrors, psqlErrors, serverErrors } = require('./errors');
const {
  postCommentById,
  getApiDocs,
  getUsers,
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
  patchArticleById,
  deleteCommentById,
} = require('./controllers/controllers');

const app = express(); // creates instance of express...
app.use(express.json()); // parses request body to req.body...

// --== Endpoints ==--

// POSTs...
app.post('/api/articles/:article_id/comments', postCommentById);

// GETs...
app.get('/api', getApiDocs);
app.get('/api/users', getUsers);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getArticleComments);

// PATCHs...
app.patch('/api/articles/:article_id', patchArticleById);

// DELETEs...
app.delete('/api/comments/:comment_id', deleteCommentById);

// if requested endpoint is not found...
app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});

// --== Error Handlers ==--
app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);

module.exports = app;
