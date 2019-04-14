const express = require('express');
const routeConfig = require('./config/route-config.js');
const appConfig = require('./config/main-config.js');

const app = express();

appConfig.init(app, express);
routeConfig.init(app);

module.exports = app;
