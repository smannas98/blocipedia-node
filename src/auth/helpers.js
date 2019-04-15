const bcrypt = require('bcryptjs');

module.exports = {
  ensureAuthenticated(req, res, next) {
    if (!res.user) {
      req.flash('notice', 'you must be signed in to do that.');
      return res.redirect('/users/sign_in');
    } else {
      next();
    }
  },
  comparePass(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  },
};
