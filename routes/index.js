const express = require('express');
const router = express.Router();
const path = require('path');

// Route principale - Afficher le CV directement
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../cv/views/index.html'));
});

// Route CV
router.get('/cv', (req, res) => {
    res.sendFile(path.join(__dirname, '../cv/views/index.html'));
});

// Route About
router.get('/about', (req, res) => {
    res.json({
        projet: 'Projet Node.js - Serveur Express',
        auteur: 'Idir ZEGTITOUCHE',
        description: 'Serveur Node.js avec Express et système de routing',
        technologies: ['Node.js', 'Express', 'JavaScript']
    });
});

module.exports = router;
