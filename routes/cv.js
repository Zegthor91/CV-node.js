const express = require('express');
const router = express.Router();
const cvController = require('../controller/cvController');

// Page HTML
router.get('/page', cvController.render);

// Données CV
router.get('/', cvController.getAll);
router.put('/', cvController.update);

// Expériences
router.post('/experiences', cvController.addExperience);
router.delete('/experiences/:id', cvController.deleteExperience);

module.exports = router;
