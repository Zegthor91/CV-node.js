const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// ==================== ROUTES USERS ====================

// GET - Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            status: 'success',
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET - Récupérer un utilisateur par ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

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
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST - Créer un nouvel utilisateur
router.post('/users', async (req, res) => {
    try {
        const { nom, prenom, email } = req.body;

        if (!nom || !prenom || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Tous les champs sont requis (nom, prenom, email)'
            });
        }

        const newUser = await User.create({ nom, prenom, email });

        res.status(201).json({
            status: 'success',
            message: 'Utilisateur créé avec succès',
            data: newUser
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT - Mettre à jour un utilisateur
router.put('/users/:id', async (req, res) => {
    try {
        const { nom, prenom, email } = req.body;
        const updates = {};

        if (nom) updates.nom = nom;
        if (prenom) updates.prenom = prenom;
        if (email) updates.email = email;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

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
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE - Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

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
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// ==================== ROUTES PRODUCTS ====================

// GET - Récupérer tous les produits
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({
            status: 'success',
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET - Récupérer un produit par ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

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
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST - Créer un nouveau produit
router.post('/products', async (req, res) => {
    try {
        const { nom, prix, stock } = req.body;

        if (!nom || prix === undefined || stock === undefined) {
            return res.status(400).json({
                status: 'error',
                message: 'Tous les champs sont requis (nom, prix, stock)'
            });
        }

        const newProduct = await Product.create({
            nom,
            prix: parseFloat(prix),
            stock: parseInt(stock)
        });

        res.status(201).json({
            status: 'success',
            message: 'Produit créé avec succès',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT - Mettre à jour un produit
router.put('/products/:id', async (req, res) => {
    try {
        const { nom, prix, stock } = req.body;
        const updates = {};

        if (nom) updates.nom = nom;
        if (prix !== undefined) updates.prix = parseFloat(prix);
        if (stock !== undefined) updates.stock = parseInt(stock);

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

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
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE - Supprimer un produit
router.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

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
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
