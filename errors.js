// --== Error Handlers ==--
exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  if (
    err.code === '22P02' ||
    err.code === '42703' ||
    err.code === '23502' ||
    err.code === '23503'
  ) {
    // 22P02: Invalid input type/syntax
    // 42703: Column does not exist
    // 23502: Column constraint violated
    // 23503: Column foreign key constraint violated
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    next(err);
  }
};

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Server Error' });
};
