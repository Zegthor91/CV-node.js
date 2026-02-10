const express = require('express');
const router = express.Router();
const publicController = require('../controller/publicController');

// Pages publiques
router.get('/', publicController.home);
router.get('/experience', publicController.experience);
router.get('/formation', publicController.formation);
router.get('/loisirs', publicController.loisirs);
router.get('/contact', publicController.showContact);
router.post('/contact', publicController.submitContact);

module.exports = router;
