const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const Models = require('./models');

const Users = Models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'user_name',
  passwordField: 'password',
}, (username, password, callback) => {
  Users.findOne({ user_name: username }, (error, user) => {
    if (error) {
      return callback(error);
    } if (!user) {
      return callback(null, false, { message: 'Incorrect username or password.' });
    }
    return callback(null, user);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret',
}, (jwtPayload, callback) => Users.findById(jwtPayload._id).then((user) => callback(null, user))
  .catch((error) => callback(error))));
