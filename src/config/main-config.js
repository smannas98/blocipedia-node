require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passportConfig = require('./passport');

const viewsFolder = path.join(__dirname, '..', 'views');

module.exports = {
  init(app, express) {
    app.set('views', viewsFolder);
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    //app.use(express.static(path.join(__dirname, '..', 'assets')));
    //app.use(logger('dev'));
    app.use(expressValidator());
    app.use(session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 },
    }));
    app.use(flash());
    passportConfig.init(app);
    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    });
    app.use(logger('dev'));
    app.use(express.static(path.join(__dirname, '..', 'assets')));
  },
};
