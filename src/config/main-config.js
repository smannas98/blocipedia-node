require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressValidator = require('express-validator');
const flash = require('express-flash');
const session = require('express-session');

const viewsFolder = path.join(__dirname, '..', 'views');

module.exports = {
  init(app, express) {
    app.set('views', viewsFolder);
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '..', 'assets')));
    app.use(logger('dev'));
    app.use(expressValidator());
    app.use(flash());
    app.use(express.cookieParser('do not let this get checked into version control'));
    app.use(session({
      secret: process.env.cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1.21e+9 },
    }));
  },
};
