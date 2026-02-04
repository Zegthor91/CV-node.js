const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const adminController = require('../controller/adminController');

// Toutes les routes admin nécessitent une authentification
router.use(requireAuth);

// Dashboard
router.get('/', adminController.dashboard);

// Expériences
router.get('/experiences', adminController.listExperiences);
router.get('/experiences/new', adminController.newExperienceForm);
router.post('/experiences', adminController.createExperience);
router.post('/experiences/:id/delete', adminController.deleteExperience);

// Formations
router.get('/formations', adminController.listFormations);
router.get('/formations/new', adminController.newFormationForm);
router.post('/formations', adminController.createFormation);
router.post('/formations/:id/delete', adminController.deleteFormation);

// Loisirs
router.get('/loisirs', adminController.listLoisirs);
router.get('/loisirs/new', adminController.newLoisirForm);
router.post('/loisirs', adminController.createLoisir);
router.post('/loisirs/:id/delete', adminController.deleteLoisir);

// Messages
router.get('/messages', adminController.listMessages);
router.post('/messages/:id/read', adminController.markMessageRead);
router.post('/messages/:id/delete', adminController.deleteMessage);

module.exports = router;
