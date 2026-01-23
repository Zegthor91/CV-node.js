const fileStore = require('../utils/fileStore');

/**
 * Contrôleur Contact - Gestion des messages de contact
 * Gère les opérations liées aux messages : création, lecture, mise à jour, suppression
 */

/**
 * Créer et envoyer un nouveau message de contact
 */
const createMessage = (req, res) => {
    try {
        const { nom, prenom, email, sujet, message, telephone } = req.body;

        // Validation des champs requis
        if (!nom || !email || !sujet || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'Les champs nom, email, sujet et message sont requis',
                missingFields: {
                    nom: !nom,
                    email: !email,
                    sujet: !sujet,
                    message: !message
                }
            });
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Format d\'email invalide'
            });
        }

        // Créer le nouveau message avec toutes les informations
        const newMessage = fileStore.add('messages', {
            nom,
            prenom: prenom || '',
            email,
            telephone: telephone || '',
            sujet,
            message,
            date: new Date().toISOString(),
            dateLisible: new Date().toLocaleString('fr-FR'),
            lu: false,
            repondu: false,
            important: false,
            categorie: categorizeMessage(sujet)
        });

        if (!newMessage) {
            return res.status(500).json({
                status: 'error',
                message: 'Erreur lors de la création du message'
            });
        }

        res.status(201).json({
            status: 'success',
            message: 'Message envoyé avec succès',
            data: newMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de l\'envoi du message',
            error: error.message
        });
    }
};

/**
 * Récupérer tous les messages
 */
const getAllMessages = (req, res) => {
    try {
        const messages = fileStore.findAll('messages');

        // Trier par date (plus récent en premier)
        const sortedMessages = messages.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        res.json({
            status: 'success',
            count: messages.length,
            data: sortedMessages
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des messages',
            error: error.message
        });
    }
};

/**
 * Récupérer un message par ID
 */
const getMessageById = (req, res) => {
    try {
        const { id } = req.params;
        const message = fileStore.findById('messages', id);

        if (!message) {
            return res.status(404).json({
                status: 'error',
                message: 'Message non trouvé'
            });
        }

        res.json({
            status: 'success',
            data: message
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération du message',
            error: error.message
        });
    }
};

/**
 * Récupérer les messages non lus
 */
const getUnreadMessages = (req, res) => {
    try {
        const messages = fileStore.search('messages', msg => msg.lu === false);

        res.json({
            status: 'success',
            count: messages.length,
            data: messages.sort((a, b) => new Date(b.date) - new Date(a.date))
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des messages non lus',
            error: error.message
        });
    }
};

/**
 * Récupérer les messages par catégorie
 */
const getMessagesByCategory = (req, res) => {
    try {
        const { categorie } = req.params;
        const messages = fileStore.search('messages', msg => msg.categorie === categorie);

        res.json({
            status: 'success',
            count: messages.length,
            categorie: categorie,
            data: messages.sort((a, b) => new Date(b.date) - new Date(a.date))
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des messages par catégorie',
            error: error.message
        });
    }
};

/**
 * Marquer un message comme lu
 */
const markAsRead = (req, res) => {
    try {
        const { id } = req.params;

        const updatedMessage = fileStore.update('messages', id, {
            lu: true,
            dateLecture: new Date().toISOString()
        });

        if (!updatedMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message non trouvé'
            });
        }

        res.json({
            status: 'success',
            message: 'Message marqué comme lu',
            data: updatedMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour du message',
            error: error.message
        });
    }
};

/**
 * Marquer un message comme non lu
 */
const markAsUnread = (req, res) => {
    try {
        const { id } = req.params;

        const updatedMessage = fileStore.update('messages', id, {
            lu: false,
            dateLecture: null
        });

        if (!updatedMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message non trouvé'
            });
        }

        res.json({
            status: 'success',
            message: 'Message marqué comme non lu',
            data: updatedMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour du message',
            error: error.message
        });
    }
};

/**
 * Marquer un message comme important
 */
const markAsImportant = (req, res) => {
    try {
        const { id } = req.params;

        const updatedMessage = fileStore.update('messages', id, {
            important: true
        });

        if (!updatedMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message non trouvé'
            });
        }

        res.json({
            status: 'success',
            message: 'Message marqué comme important',
            data: updatedMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour du message',
            error: error.message
        });
    }
};

/**
 * Marquer un message comme répondu
 */
const markAsAnswered = (req, res) => {
    try {
        const { id } = req.params;
        const { reponse } = req.body;

        const updatedMessage = fileStore.update('messages', id, {
            repondu: true,
            dateReponse: new Date().toISOString(),
            reponse: reponse || ''
        });

        if (!updatedMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message non trouvé'
            });
        }

        res.json({
            status: 'success',
            message: 'Message marqué comme répondu',
            data: updatedMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour du message',
            error: error.message
        });
    }
};

/**
 * Supprimer un message
 */
const deleteMessage = (req, res) => {
    try {
        const { id } = req.params;
        const deletedMessage = fileStore.delete('messages', id);

        if (!deletedMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message non trouvé'
            });
        }

        res.json({
            status: 'success',
            message: 'Message supprimé avec succès',
            data: deletedMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression du message',
            error: error.message
        });
    }
};

/**
 * Supprimer plusieurs messages
 */
const deleteMultipleMessages = (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Un tableau d\'IDs est requis'
            });
        }

        const deletedMessages = [];
        const notFoundIds = [];

        ids.forEach(id => {
            const deleted = fileStore.delete('messages', id);
            if (deleted) {
                deletedMessages.push(deleted);
            } else {
                notFoundIds.push(id);
            }
        });

        res.json({
            status: 'success',
            message: `${deletedMessages.length} message(s) supprimé(s)`,
            deleted: deletedMessages.length,
            notFound: notFoundIds.length,
            notFoundIds: notFoundIds
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression des messages',
            error: error.message
        });
    }
};

/**
 * Rechercher des messages
 */
const searchMessages = (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                status: 'error',
                message: 'Un terme de recherche est requis'
            });
        }

        const searchTerm = query.toLowerCase();
        const messages = fileStore.search('messages', msg => {
            return (
                msg.nom.toLowerCase().includes(searchTerm) ||
                msg.email.toLowerCase().includes(searchTerm) ||
                msg.sujet.toLowerCase().includes(searchTerm) ||
                msg.message.toLowerCase().includes(searchTerm) ||
                (msg.prenom && msg.prenom.toLowerCase().includes(searchTerm))
            );
        });

        res.json({
            status: 'success',
            count: messages.length,
            query: query,
            data: messages.sort((a, b) => new Date(b.date) - new Date(a.date))
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la recherche',
            error: error.message
        });
    }
};

/**
 * Obtenir les statistiques des messages
 */
const getMessagesStats = (req, res) => {
    try {
        const messages = fileStore.findAll('messages');

        const stats = {
            total: messages.length,
            nonLus: messages.filter(m => !m.lu).length,
            lus: messages.filter(m => m.lu).length,
            repondus: messages.filter(m => m.repondu).length,
            nonRepondus: messages.filter(m => !m.repondu).length,
            importants: messages.filter(m => m.important).length,
            parCategorie: {},
            messagesRecents: messages
                .filter(m => {
                    const dateMsg = new Date(m.date);
                    const aujourdhui = new Date();
                    const diff = (aujourdhui - dateMsg) / (1000 * 60 * 60 * 24);
                    return diff <= 7;
                })
                .length,
            dernierMessage: messages.length > 0
                ? messages.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
                : null
        };

        // Compter par catégorie
        messages.forEach(msg => {
            const cat = msg.categorie || 'autre';
            stats.parCategorie[cat] = (stats.parCategorie[cat] || 0) + 1;
        });

        res.json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des statistiques',
            error: error.message
        });
    }
};

/**
 * Archiver un message (marquer comme archivé)
 */
const archiveMessage = (req, res) => {
    try {
        const { id } = req.params;

        const updatedMessage = fileStore.update('messages', id, {
            archive: true,
            dateArchivage: new Date().toISOString()
        });

        if (!updatedMessage) {
            return res.status(404).json({
                status: 'error',
                message: 'Message non trouvé'
            });
        }

        res.json({
            status: 'success',
            message: 'Message archivé',
            data: updatedMessage
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de l\'archivage du message',
            error: error.message
        });
    }
};

/**
 * Obtenir les messages archivés
 */
const getArchivedMessages = (req, res) => {
    try {
        const messages = fileStore.search('messages', msg => msg.archive === true);

        res.json({
            status: 'success',
            count: messages.length,
            data: messages.sort((a, b) => new Date(b.date) - new Date(a.date))
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des messages archivés',
            error: error.message
        });
    }
};

/**
 * Fonction helper pour catégoriser un message selon son sujet
 */
function categorizeMessage(sujet) {
    const sujetLower = sujet.toLowerCase();

    if (sujetLower.includes('emploi') || sujetLower.includes('recrutement') || sujetLower.includes('candidature')) {
        return 'emploi';
    }
    if (sujetLower.includes('projet') || sujetLower.includes('collaboration')) {
        return 'projet';
    }
    if (sujetLower.includes('question') || sujetLower.includes('information') || sujetLower.includes('renseignement')) {
        return 'question';
    }
    if (sujetLower.includes('bug') || sujetLower.includes('erreur') || sujetLower.includes('problème')) {
        return 'support';
    }
    if (sujetLower.includes('feedback') || sujetLower.includes('suggestion') || sujetLower.includes('amélioration')) {
        return 'feedback';
    }

    return 'autre';
}

// Exporter toutes les fonctions
module.exports = {
    createMessage,
    getAllMessages,
    getMessageById,
    getUnreadMessages,
    getMessagesByCategory,
    markAsRead,
    markAsUnread,
    markAsImportant,
    markAsAnswered,
    deleteMessage,
    deleteMultipleMessages,
    searchMessages,
    getMessagesStats,
    archiveMessage,
    getArchivedMessages
};
