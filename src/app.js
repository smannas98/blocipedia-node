const express = require('express');
const routeConfig = require('./config/route-config.js');
const appConfig = require('./config/main-config.js');

const app = express();

app.use('/', (req, res, next) => {
  res.send('this is just a test');
});
appConfig.init(app, express);
routeConfig.init(app);

module.exports = app;
