const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('static/index', { title: 'Welcome to Blocipedia' });
});

module.exports = router;
