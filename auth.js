import passport from 'passport';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

import './passport.js';

/** @module Authentication */

/** Creation of JWT token. */
const generateJWTToken = (user) => jwt.sign(user, JWT_SECRET, {
  subject: user.user_name,
  expiresIn: '7d',
  algorithm: 'HS256',
});

/** Definition and functionality of /login endpoint. */
const Login = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error1, user) => {
      if (error1 || !user) {
        return res.status(400).json({
          message: 'Wrong username or password.',
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

export default Login;
