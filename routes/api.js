const express = require('express');
const router = express.Router();
const fileStore = require('../utils/fileStore');

// Initialiser les données par défaut si les fichiers n'existent pas
const defaultUsers = [
    { id: 1, nom: 'Idir', prenom: 'Zegtitouche', email: 'idir@efrei.net' },
    { id: 2, nom: 'Sabri', prenom: 'Kasri', email: 'sabri@efrei.net' },
    { id: 3, nom: 'Tazio', prenom: 'Giampiccolo', email: 'tazio@efrei.net' }
];

const defaultProducts = [
    { id: 1, nom: 'Ordinateur portable', prix: 899.99, stock: 15 },
    { id: 2, nom: 'Souris sans fil', prix: 29.99, stock: 50 },
    { id: 3, nom: 'Clavier mécanique', prix: 79.99, stock: 30 }
];

// Initialiser les fichiers avec les données par défaut
if (!fileStore.exists('users')) {
    fileStore.write('users', defaultUsers);
}

if (!fileStore.exists('products')) {
    fileStore.write('products', defaultProducts);
}

// ==================== ROUTES USERS ====================

// GET - Récupérer tous les utilisateurs
router.get('/users', (req, res) => {
    const users = fileStore.findAll('users');
    res.json({
        status: 'success',
        count: users.length,
        data: users
    });
});

// GET - Récupérer un utilisateur par ID
router.get('/users/:id', (req, res) => {
    const user = fileStore.findById('users', req.params.id);

    if (!user) {
        return res.status(404).json({
            status: 'error',
            message: 'Utilisateur non trouvé'
        });
    }

    res.json({
        status: 'success',
        data: user
    });
});

// POST - Créer un nouvel utilisateur
router.post('/users', (req, res) => {
    const { nom, prenom, email } = req.body;

    if (!nom || !prenom || !email) {
        return res.status(400).json({
            status: 'error',
            message: 'Tous les champs sont requis (nom, prenom, email)'
        });
    }

    const newUser = fileStore.add('users', { nom, prenom, email });

    if (!newUser) {
        return res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la création de l\'utilisateur'
        });
    }

    res.status(201).json({
        status: 'success',
        message: 'Utilisateur créé avec succès',
        data: newUser
    });
});

// PUT - Mettre à jour un utilisateur
router.put('/users/:id', (req, res) => {
    const { nom, prenom, email } = req.body;
    const updates = {};

    if (nom) updates.nom = nom;
    if (prenom) updates.prenom = prenom;
    if (email) updates.email = email;

    const updatedUser = fileStore.update('users', req.params.id, updates);

    if (!updatedUser) {
        return res.status(404).json({
            status: 'error',
            message: 'Utilisateur non trouvé'
        });
    }

    res.json({
        status: 'success',
        message: 'Utilisateur mis à jour',
        data: updatedUser
    });
});

// DELETE - Supprimer un utilisateur
router.delete('/users/:id', (req, res) => {
    const deletedUser = fileStore.delete('users', req.params.id);

    if (!deletedUser) {
        return res.status(404).json({
            status: 'error',
            message: 'Utilisateur non trouvé'
        });
    }

    res.json({
        status: 'success',
        message: 'Utilisateur supprimé',
        data: deletedUser
    });
});

// ==================== ROUTES PRODUCTS ====================

// GET - Récupérer tous les produits
router.get('/products', (req, res) => {
    const products = fileStore.findAll('products');
    res.json({
        status: 'success',
        count: products.length,
        data: products
    });
});

// GET - Récupérer un produit par ID
router.get('/products/:id', (req, res) => {
    const product = fileStore.findById('products', req.params.id);

    if (!product) {
        return res.status(404).json({
            status: 'error',
            message: 'Produit non trouvé'
        });
    }

    res.json({
        status: 'success',
        data: product
    });
});

// POST - Créer un nouveau produit
router.post('/products', (req, res) => {
    const { nom, prix, stock } = req.body;

    if (!nom || prix === undefined || stock === undefined) {
        return res.status(400).json({
            status: 'error',
            message: 'Tous les champs sont requis (nom, prix, stock)'
        });
    }

    const newProduct = fileStore.add('products', {
        nom,
        prix: parseFloat(prix),
        stock: parseInt(stock)
    });

    if (!newProduct) {
        return res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la création du produit'
        });
    }

    res.status(201).json({
        status: 'success',
        message: 'Produit créé avec succès',
        data: newProduct
    });
});

// PUT - Mettre à jour un produit
router.put('/products/:id', (req, res) => {
    const { nom, prix, stock } = req.body;
    const updates = {};

    if (nom) updates.nom = nom;
    if (prix !== undefined) updates.prix = parseFloat(prix);
    if (stock !== undefined) updates.stock = parseInt(stock);

    const updatedProduct = fileStore.update('products', req.params.id, updates);

    if (!updatedProduct) {
        return res.status(404).json({
            status: 'error',
            message: 'Produit non trouvé'
        });
    }

    res.json({
        status: 'success',
        message: 'Produit mis à jour',
        data: updatedProduct
    });
});

// DELETE - Supprimer un produit
router.delete('/products/:id', (req, res) => {
    const deletedProduct = fileStore.delete('products', req.params.id);

    if (!deletedProduct) {
        return res.status(404).json({
            status: 'error',
            message: 'Produit non trouvé'
        });
    }

    res.json({
        status: 'success',
        message: 'Produit supprimé',
        data: deletedProduct
    });
});

// ==================== ROUTE CV API ====================

router.get('/cv', (req, res) => {
    const cvData = {
        nom: "Idir ZEGTITOUCHE",
        titre: "Développeur web et d'applications",
        localisation: "Vitry sur Seine, France",
        email: "idirzegtitouche@efrei.net",
        profil: "Étudiant en école d'ingénieur passionné par le développement web et d'applications.",
        experiences: [
            {
                poste: "Bac Générale - Lycée Adolphe Chérioux",
                periode: "2021 - 2024"
            },
            {
                poste: "Bachelor : Développement Web et Applications - EFREI Paris",
                periode: "2024 - 2027"
            }
        ],
        formation: [
            {
                etablissement: "École d'ingénieur — EFREI",
                localisation: "Villejuif",
                periode: "En cours"
            },
            {
                etablissement: "Lycée — Adolphe Chérioux",
                localisation: "Vitry sur Seine"
            }
        ],
        loisirs: ["Football", "Musculation", "Cosplay"]
    };

    res.json({
        status: 'success',
        data: cvData
    });
});

module.exports = router;
