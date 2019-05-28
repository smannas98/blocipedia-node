const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authHelper = require('../auth/helpers');
const { User } = require('../db/models');

module.exports = {
  init(app) {
    console.log('Entering passport.init');
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy({
      usernameField: 'email',
    }, (email, password, done) => {
      // console.log(email);
      User.findOne({
        where: { email },
      })
        .then((user) => {
         console.log(user);
          if (!user || !authHelper.comparePassword(password, user.password)) {
            console.log('passport config says no user available');
            return done(null, false, { message: 'Invalid email or password' });
          }
          return done(null, user);
        });
    }));
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
      // console.log('user', User);
      // done(null, userId);
      User.findOne({ where: { id } }).then((user) => {
        done(null, user);
      })
        .catch((err) => {
          done(err, user);
        });
    });
  },
};
