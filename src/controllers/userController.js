const passport = require('passport');
const userQueries = require('../db/queries.users.js');

module.exports = {
  signUp(req, res, next) {
    console.log('userController.signUp');
    res.render('users/signup');
  },
  create(req, res, next) {
    const newUser = {
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        console.log(err);
        req.flash('error', err);
        res.redirect('/users/sign_up');
      } else {
        passport.authenticate('local')(req, res, () => {
          req.flash('notice', 'You have successfully signed in!');
          res.redirect('/');
        });
      }
    });
  },
};
