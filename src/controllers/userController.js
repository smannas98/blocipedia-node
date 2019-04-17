const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const userQueries = require('../db/queries.users.js');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // api to send out emails

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
    const msg = {
      to: req.body.email,
      from: 'seanmanns02@gmail.com',
      subject: 'User Created!',
      text: 'You have successfully created a new user.',
      html: '<strong>You have successfully created a new user.</strong>',
    };
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        console.log(err);
        req.flash('error', err);
        res.redirect('/users/sign_up');
      } else {
        passport.authenticate('local')(req, res, () => {
          req.flash('notice', 'You have successfully signed in!');
          sgMail.send(msg);
          res.redirect('/');
        });
      }
    });
  },
  signInForm(req, res, next) {
    res.render('users/signin');
  },
  signIn(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        console.log(err);
        return next(err);
      }
      if (!user) {
        console.log('There is no user??');
        req.flash(info.message);
        return res.redirect('/users/sign_in');
      }
      req.flash('You have successfully signed in!');
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          return next(err);
        }
        return res.redirect('/');
      });
    })(req, res, next);
/*
    passport.authenticate('local')(req, res, () => {
      if (!req.user) {
        req.flash('Sign in failed. Please try again.');
        res.redirect('/users/sign_in');
      } else {
        req.flash('You have successfully signed in!');
        res.redirect('/');
      }
    });
*/
  },
};
