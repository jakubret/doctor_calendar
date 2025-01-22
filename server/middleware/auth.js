const jwt = require('jsonwebtoken');
const config = require('../config.json');  // Adjust the path as necessary to your config file

const checkJwt = (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

  if (!token) {
    return res.status(401).send({ message: 'No token provided.' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Failed to authenticate token.' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = { checkJwt };
