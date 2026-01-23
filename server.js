// Importation des modules nécessaires
const path = require('path');
const express = require('express');
const routes = require('./routes');
const apiRoutes = require('./routes/api');
const cvRoutes = require('./routes/cv');
const contactRoutes = require('./routes/contact');
const app = express();

// Configuration du port
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les données URL-encoded (formulaires)
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour les fichiers CSS et assets du CV
app.use(express.static(path.join(__dirname, 'cv/public')));

// Middleware pour les vues (si vous utilisez un moteur de template)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Middleware de logging personnalisé
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes principales
app.use('/', routes);

// Routes API
app.use('/api', apiRoutes);

// Routes CV
app.use('/api/cv', cvRoutes);

// Routes Contact
app.use('/api/contact', contactRoutes);

// Route de test
app.get('/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'Le serveur fonctionne correctement !',
        timestamp: new Date().toISOString()
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route non trouvée',
        path: req.url
    });
});

// Gestion des erreurs serveur
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('Serveur Node.js démarré avec succès !');
    console.log('='.repeat(50));
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Répertoire: ${__dirname}`);
    console.log('='.repeat(50) + '\n');
});

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
    console.log('\n /!\ SIGTERM reçu. Arrêt du serveur...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n /!\  SIGINT reçu. Arrêt du serveur...');
    process.exit(0);
});

module.exports = app;
