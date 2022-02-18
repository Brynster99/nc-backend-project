// --== Error Handlers ==--
exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    // 22P02: Invalid input type/syntax
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.code === '42703') {
    // 42703: Column does not exist
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    next(err);
  }
};

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Server Error' });
};
