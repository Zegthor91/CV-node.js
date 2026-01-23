const express = require('express');
const router = express.Router();
const cvController = require('../controller/cvController');

/**
 * Routes CV - Utilise le contrôleur cvController
 * Toutes les routes pour gérer le CV et les messages de contact
 */

// ==================== ROUTES PAGE HTML ====================

// GET - Afficher la page HTML du CV
router.get('/page', cvController.renderCVPage);

// ==================== ROUTES DONNÉES CV ====================

// GET - Récupérer toutes les données du CV
router.get('/', cvController.getCVData);

// PUT - Mettre à jour les informations générales du CV
router.put('/', cvController.updateCVInfo);

// POST - Réinitialiser le CV
router.post('/reset', cvController.resetCV);

// GET - Statistiques du CV
router.get('/stats', cvController.getCVStats);

// ==================== ROUTES EXPÉRIENCES ====================

// POST - Ajouter une expérience
router.post('/experiences', cvController.addExperience);

// DELETE - Supprimer une expérience
router.delete('/experiences/:id', cvController.deleteExperience);

// ==================== ROUTES COMPÉTENCES ====================

// POST - Ajouter une compétence
router.post('/competences', cvController.addCompetence);

// ==================== ROUTES MESSAGES DE CONTACT ====================

// POST - Envoyer un message de contact
router.post('/contact', cvController.saveContactMessage);

// GET - Récupérer tous les messages
router.get('/messages', cvController.getAllMessages);

// PUT - Marquer un message comme lu
router.put('/messages/:id/read', cvController.markMessageAsRead);

// DELETE - Supprimer un message
router.delete('/messages/:id', cvController.deleteMessage);

module.exports = router;
