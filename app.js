const express = require('express');
const { customErrors, psqlErrors, serverErrors } = require('./errors');
const {
  getApiDocs,
  getUsers,
  getTopics,
  getArticles,
  getArticleById,
  patchArticleById,
} = require('./controllers/controllers');

const app = express(); // creates instance of express...
app.use(express.json()); // parses request body to req.body...

// --== Endpoints ==--
app.get('/api', getApiDocs);
app.get('/api/users', getUsers);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

// if requested endpoint is not found...
app.all('/*', (req, res) => {
  console.log('in pathNotFound api handler');
  res.status(404).send({ msg: 'Path not found' });
});

// --== Error Handlers ==--
app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);

module.exports = app;
