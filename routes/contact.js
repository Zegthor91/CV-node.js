const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');

// Messages
router.post('/', contactController.create);
router.get('/', contactController.getAll);
router.get('/search', contactController.search);
router.get('/:id', contactController.getById);
router.put('/:id/read', contactController.markAsRead);
router.delete('/:id', contactController.delete);

module.exports = router;
