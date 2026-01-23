const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');

/**
 * Routes Contact - Gestion complète des messages de contact
 * Utilise le contrôleur contactController
 */

// ==================== ROUTES MESSAGES ====================

// POST - Créer un nouveau message
router.post('/', contactController.createMessage);

// GET - Récupérer tous les messages
router.get('/', contactController.getAllMessages);

// GET - Récupérer un message par ID
router.get('/:id', contactController.getMessageById);

// DELETE - Supprimer un message
router.delete('/:id', contactController.deleteMessage);

// ==================== ROUTES FILTRES ====================

// GET - Messages non lus
router.get('/filter/unread', contactController.getUnreadMessages);

// GET - Messages archivés
router.get('/filter/archived', contactController.getArchivedMessages);

// GET - Messages par catégorie
router.get('/filter/category/:categorie', contactController.getMessagesByCategory);

// ==================== ROUTES ACTIONS ====================

// PUT - Marquer comme lu
router.put('/:id/read', contactController.markAsRead);

// PUT - Marquer comme non lu
router.put('/:id/unread', contactController.markAsUnread);

// PUT - Marquer comme important
router.put('/:id/important', contactController.markAsImportant);

// PUT - Marquer comme répondu
router.put('/:id/answered', contactController.markAsAnswered);

// PUT - Archiver un message
router.put('/:id/archive', contactController.archiveMessage);

// ==================== ROUTES MULTIPLES ====================

// DELETE - Supprimer plusieurs messages
router.post('/delete-multiple', contactController.deleteMultipleMessages);

// ==================== ROUTES UTILITAIRES ====================

// GET - Rechercher des messages
router.get('/search/query', contactController.searchMessages);

// GET - Statistiques des messages
router.get('/stats/overview', contactController.getMessagesStats);

module.exports = router;
