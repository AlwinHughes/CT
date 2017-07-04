const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../../config');

module.exports = function(req, res, onUnautharised, onAuthorised) {
  if(!req.headers.authorization)
    return onUnautharised(req, res);

  const token = req.headers.authorization.split(' ')[1];

  return jwt.verify(token, config.jwtSecret, function(err, decode) {
    if(err)
      return onUnautharised(req, res);

    const userId = decode.sub;
    return User.findById(userId, function(userErr, user) {
      if(userErr || !user)
        return onUnautharised(req, res);

      return onAuthorised(req, res, userId);
    });
  })
}