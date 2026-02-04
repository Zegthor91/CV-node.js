// Chargement des variables d'environnement
require('dotenv').config();

// Importation des modules nécessaires
const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const { addUserToLocals } = require('./middleware/auth');

// Importation des routes
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');
const cvRoutes = require('./routes/cv');
const contactRoutes = require('./routes/contact');

const app = express();

// Configuration du port
const PORT = process.env.PORT || 3000;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les données URL-encoded (formulaires)
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour les fichiers CSS et assets du CV
app.use(express.static(path.join(__dirname, 'cv/public')));

// Middleware pour les vues
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Configuration des sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'cv-project-secret-key-dev',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/cv_project'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 heures
    }
}));

// Middleware global - ajouter l'utilisateur aux locals pour les vues
app.use(addUserToLocals);

// Middleware flash messages
app.use((req, res, next) => {
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    next();
});

// Middleware de logging personnalisé
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes Auth (login, register, logout)
app.use('/', authRoutes);

// Routes Admin
app.use('/admin', adminRoutes);

// Routes principales (pages publiques)
app.use('/', routes);

// Routes API
app.use('/api', apiRoutes);

// Routes CV API
app.use('/api/cv', cvRoutes);

// Routes Contact API
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
    res.status(404).render('pages/404', { title: 'Page non trouvée' });
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

// Connexion à MongoDB puis démarrage du serveur
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log('\n' + '='.repeat(50));
        console.log('Serveur Node.js démarré avec succès !');
        console.log('='.repeat(50));
        console.log(`URL: http://localhost:${PORT}`);
        console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Répertoire: ${__dirname}`);
        console.log('='.repeat(50) + '\n');
    });
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
