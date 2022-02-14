const app = require('express')();

const { getTopics } = require('./controllers/controllers');

app.get('/api/topics', getTopics);

// Final error (404 - path not found)
app.all('*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});

module.exports = app;
