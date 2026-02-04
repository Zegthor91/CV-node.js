const express = require('express');
const router = express.Router();
const pageController = require('../controller/pageController');

// Pages publiques
router.get('/', pageController.home);
router.get('/experience', pageController.experience);
router.get('/formation', pageController.formation);
router.get('/loisirs', pageController.loisirs);
router.get('/contact', pageController.showContact);
router.post('/contact', pageController.submitContact);

module.exports = router;
