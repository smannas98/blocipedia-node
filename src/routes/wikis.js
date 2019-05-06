const express = require('express');
const wikiController = require('../controllers/wikiController');

const router = express.Router();

router.get('/wikis', wikiController.index);
router.get('/wikis/:id', wikiController.show);
router.get('/wikis/new', wikiController.newForm);
router.get('/wikis/:id/edit', wikiController.edit);

router.post('/wikis/create', wikiController.create);
router.post('/wikis/:id/update', wikiController.update);
router.post('/wikis/:id/destroy', wikiController.destroy);

module.exports = router;
