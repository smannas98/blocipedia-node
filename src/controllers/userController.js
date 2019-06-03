const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const stripe = require('stripe')('sk_test_QNHjEBAmf0C8MgBRuUHRJGgZ00DePFd2VG');
const userQueries = require('../db/queries.users.js');

const keyPublishable = 'pk_test_hMAgNIauwzj5kLnVjqMLxqlu00btbleSlk';

sgMail.setApiKey(process.env.SENDGRID_API_KEY); // api to send out emails

module.exports = {
  signUp(req, res, next) {
    console.log('enter userController.signUp');
    res.render('users/signup', { error: false });
  },
  create(req, res, next) {
    console.log('enter userController.create');

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
      console.log('entering userController.create:createUser');
      if (err) {
        console.log('userController.create:createUser error', err);
        req.flash('error', err);
        res.redirect('/users/sign_up');
      } else {
        console.log('userController.create:createUser successful');
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
    passport.authenticate('local', (err, user, info) => {
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
      req.logIn(user, (err) => {
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
  signOut(req, res, next) {
    req.logOut();
    res.redirect('/');
  },
  upgradeForm(req, res, next) {
    res.render('users/upgrade');
  },
  downgradeForm(req, res, next) {
    res.render('users/downgrade');
  },
  upgrade(req, res, next) {
    const token = req.body.stripeToken;
    const charge = stripe.charges.create({
      amount: 1500,
      currency: 'usd',
      description: 'Account upgrade to premium',
      source: token,
    });
    userQueries.upgradeUser(req, (err, user) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/users/upgrade');
      } else {
        req.flash('notice', 'Your account is now premium!');
        res.redirect('/');
      }
    });
  },
  downgrade(req, res, next) {
    userQueries.downgradeUser(req, (err, user) => {
      if (err) {
        req.flash('error', err);
        res.redirect('/users/downgrade');
      } else {
        req.flash('notice', 'You have downgraded your account.');
        res.redirect('/');
      }
    });
  },
};
