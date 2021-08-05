const passport = require('passport');
const jwt = require('jsonwebtoken');
require('./passport');

const config = require('./config');

const { JWT_SECRET } = config;

const generateJWTToken = (user) => jwt.sign(user, JWT_SECRET, {
  subject: user.user_name,
  expiresIn: '7d',
  algorithm: 'HS256',
});

module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error1, user) => {
      if (error1 || !user) {
        return res.status(400).json({
          message: 'Something went wrong.',
          user,
        });
      }
      req.login(user, { session: false }, (error2) => {
        if (error2) {
          res.send(error2);
        }
        const token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
