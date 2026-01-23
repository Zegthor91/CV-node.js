const path = require('path');
const fileStore = require('../utils/fileStore');

/**
 * Contrôleur CV - Gestion des opérations liées au CV
 * Contient toutes les fonctions pour gérer le CV, les messages de contact, etc.
 */

// Données par défaut du CV
const defaultCVData = {
    nom: "Idir ZEGTITOUCHE",
    titre: "Développeur web et d'applications",
    localisation: "Vitry sur Seine, France",
    email: "idirzegtitouche@efrei.net",
    telephone: "+33 6 XX XX XX XX",
    profil: "Étudiant en école d'ingénieur passionné par le développement web et d'applications. Compétences en développement front-end et back-end, avec une forte appétence pour les nouvelles technologies.",
    experiences: [
        {
            id: 1,
            poste: "Bac Générale - Lycée Adolphe Chérioux",
            periode: "2021 - 2024",
            description: "Formation générale avec spécialité sciences"
        },
        {
            id: 2,
            poste: "Bachelor : Développement Web et Applications - EFREI Paris",
            periode: "2024 - 2027",
            description: "Formation en développement web, API, bases de données et technologies modernes"
        }
    ],
    formation: [
        {
            id: 1,
            etablissement: "École d'ingénieur — EFREI",
            localisation: "Villejuif",
            periode: "En cours",
            diplome: "Bachelor Développement Web et Applications",
            description: "Option: développement web Projet: API + interface"
        },
        {
            id: 2,
            etablissement: "Lycée — Adolphe Chérioux",
            localisation: "Vitry sur Seine",
            diplome: "Baccalauréat Général",
            description: "Spécialités scientifiques"
        }
    ],
    competences: [
        { id: 1, nom: "Node.js", niveau: "Intermédiaire" },
        { id: 2, nom: "Express", niveau: "Intermédiaire" },
        { id: 3, nom: "JavaScript", niveau: "Avancé" },
        { id: 4, nom: "HTML/CSS", niveau: "Avancé" },
        { id: 5, nom: "Git", niveau: "Intermédiaire" },
        { id: 6, nom: "API REST", niveau: "Intermédiaire" }
    ],
    loisirs: ["Football", "Musculation", "Cosplay"],
    langues: [
        { nom: "Français", niveau: "Langue maternelle" },
        { nom: "Anglais", niveau: "Intermédiaire" }
    ],
    reseaux: {
        github: "https://github.com/Zegthor91",
        linkedin: "www.linkedin.com/in/idir-zegtitouche"
    }
};

/**
 * Initialiser les données du CV si elles n'existent pas
 */
const initializeCVData = () => {
    if (!fileStore.exists('cv')) {
        fileStore.write('cv', defaultCVData);
        console.log('✅ Données CV initialisées');
    }
};

// Initialiser au chargement du module
initializeCVData();

/**
 * Afficher la page HTML du CV
 */
const renderCVPage = (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../cv/views/index.html'));
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors du chargement de la page CV',
            error: error.message
        });
    }
};

/**
 * Obtenir toutes les données du CV
 */
const getCVData = (req, res) => {
    try {
        const cvData = fileStore.read('cv', defaultCVData);

        res.json({
            status: 'success',
            data: cvData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des données CV',
            error: error.message
        });
    }
};

/**
 * Mettre à jour les informations générales du CV
 */
const updateCVInfo = (req, res) => {
    try {
        const { nom, titre, localisation, email, telephone, profil } = req.body;
        const currentCV = fileStore.read('cv', defaultCVData);

        const updates = {};
        if (nom) updates.nom = nom;
        if (titre) updates.titre = titre;
        if (localisation) updates.localisation = localisation;
        if (email) updates.email = email;
        if (telephone) updates.telephone = telephone;
        if (profil) updates.profil = profil;

        const updatedCV = { ...currentCV, ...updates };
        fileStore.write('cv', updatedCV);

        res.json({
            status: 'success',
            message: 'Informations CV mises à jour',
            data: updatedCV
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la mise à jour du CV',
            error: error.message
        });
    }
};

/**
 * Ajouter une expérience
 */
const addExperience = (req, res) => {
    try {
        const { poste, periode, description } = req.body;

        if (!poste || !periode) {
            return res.status(400).json({
                status: 'error',
                message: 'Le poste et la période sont requis'
            });
        }

        const cvData = fileStore.read('cv', defaultCVData);
        const newId = cvData.experiences.length > 0
            ? Math.max(...cvData.experiences.map(e => e.id)) + 1
            : 1;

        const newExperience = {
            id: newId,
            poste,
            periode,
            description: description || ''
        };

        cvData.experiences.push(newExperience);
        fileStore.write('cv', cvData);

        res.status(201).json({
            status: 'success',
            message: 'Expérience ajoutée',
            data: newExperience
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de l\'ajout de l\'expérience',
            error: error.message
        });
    }
};

/**
 * Supprimer une expérience
 */
const deleteExperience = (req, res) => {
    try {
        const { id } = req.params;
        const cvData = fileStore.read('cv', defaultCVData);

        const experienceIndex = cvData.experiences.findIndex(e => e.id === parseInt(id));

        if (experienceIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Expérience non trouvée'
            });
        }

        const deletedExperience = cvData.experiences.splice(experienceIndex, 1)[0];
        fileStore.write('cv', cvData);

        res.json({
            status: 'success',
            message: 'Expérience supprimée',
            data: deletedExperience
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la suppression de l\'expérience',
            error: error.message
        });
    }
};

/**
 * Ajouter une compétence
 */
const addCompetence = (req, res) => {
    try {
        const { nom, niveau } = req.body;

        if (!nom) {
            return res.status(400).json({
                status: 'error',
                message: 'Le nom de la compétence est requis'
            });
        }

        const cvData = fileStore.read('cv', defaultCVData);
        const newId = cvData.competences.length > 0
            ? Math.max(...cvData.competences.map(c => c.id)) + 1
            : 1;

        const newCompetence = {
            id: newId,
            nom,
            niveau: niveau || 'Débutant'
        };

        cvData.competences.push(newCompetence);
        fileStore.write('cv', cvData);

        res.status(201).json({
            status: 'success',
            message: 'Compétence ajoutée',
            data: newCompetence
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de l\'ajout de la compétence',
            error: error.message
        });
    }
};

/**
 * Gérer les messages de contact
 */
const saveContactMessage = (req, res) => {
    try {
        const { nom, email, sujet, message } = req.body;

        if (!nom || !email || !sujet || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'Tous les champs sont requis'
            });
        }

        const newMessage = fileStore.add('messages', {
            nom,
            email,
            sujet,
            message,
            date: new Date().toISOString(),
            lu: false
        });

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
 * Récupérer tous les messages de contact
 */
const getAllMessages = (req, res) => {
    try {
        const messages = fileStore.findAll('messages');

        res.json({
            status: 'success',
            count: messages.length,
            data: messages
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
 * Marquer un message comme lu
 */
const markMessageAsRead = (req, res) => {
    try {
        const { id } = req.params;

        const updatedMessage = fileStore.update('messages', id, { lu: true });

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
            message: 'Message supprimé',
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
 * Obtenir les statistiques du CV
 */
const getCVStats = (req, res) => {
    try {
        const cvData = fileStore.read('cv', defaultCVData);
        const messages = fileStore.findAll('messages');

        const stats = {
            experiences: cvData.experiences.length,
            formations: cvData.formation.length,
            competences: cvData.competences.length,
            loisirs: cvData.loisirs.length,
            messagesTotal: messages.length,
            messagesNonLus: messages.filter(m => !m.lu).length
        };

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
 * Réinitialiser le CV aux données par défaut
 */
const resetCV = (req, res) => {
    try {
        fileStore.write('cv', defaultCVData);

        res.json({
            status: 'success',
            message: 'CV réinitialisé aux valeurs par défaut',
            data: defaultCVData
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la réinitialisation du CV',
            error: error.message
        });
    }
};

// Exporter toutes les fonctions du contrôleur
module.exports = {
    renderCVPage,
    getCVData,
    updateCVInfo,
    addExperience,
    deleteExperience,
    addCompetence,
    saveContactMessage,
    getAllMessages,
    markMessageAsRead,
    deleteMessage,
    getCVStats,
    resetCV
};
