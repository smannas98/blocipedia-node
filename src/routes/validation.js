module.exports = {
  validateUsers(req, res, next) {
    console.log('entering validateUsers');

    // Check the body of the request for specific validation
    req.checkBody('email', 'must be valid').isEmail();
    req.checkBody('password', 'must be at least 6 characters in length')
      .isLength({ min: 6 });
    req.checkBody('passwordConfirmation', 'must match password provided')
      .optional()
      .matches(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
      console.log('validateUsers error', errors);
      res.render(req.headers.referer, { error: errors[0].msg });
    } else {
      console.log('validateUsers successful');
      next();
    }
  },
};
