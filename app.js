const app = require('express')();
const {
  getBrokenPath,
  getTopics,
  getArticles,
  getArticleById,
} = require('./controllers/controllers');
const { customErrors, psqlErrors, serverErrors } = require('./errors');

// --== Endpoints ==--
app.get('/api/brokenpath', getBrokenPath);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);

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
