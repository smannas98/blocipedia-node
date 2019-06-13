const express = require('express');
const collaboratorController = require('../controllers/collaboratorController');

const router = express.Router();

router.get('/wikis/:id/collaborators/add', collaboratorController.add);
router.get('/wikis/:id/collaborators/delete', collaboratorController.delete);

router.post('/wikis/:id/collaborators/create', collaboratorController.create);
router.post('/wikis/:id/collaborators/destroy', collaboratorController.destroy);

module.exports = router;
