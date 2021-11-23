import passport from 'passport';
import LocalStrategy from 'passport-local';
import passportJWT from 'passport-jwt';
import { Users } from './models.js';

import { JWT_SECRET } from './config.js';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

/** Definition of authentication process. */
passport.use(new LocalStrategy({
  usernameField: 'user_name',
  passwordField: 'password',
}, (username, password, callback) => {
  Users.findOne({ user_name: username }, (error, user) => {
    if (error) {
      return callback(error);
    } if (!user) {
      return callback(null, false, { message: 'Incorrect username.' });
    } if (!user.validatePassword(password)) {
      return callback(null, false, { message: 'Incorrect password.' });
    }
    return callback(null, user);
  });
}));

/** Checks for correctness of token. */
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}, (jwtPayload, callback) => Users.findById(jwtPayload._id).then((user) => callback(null, user))
  .catch((error) => callback(error))));
