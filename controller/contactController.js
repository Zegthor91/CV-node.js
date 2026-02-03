const Message = require('../models/Message');

class ContactController {
    create = async (req, res) => {
        try {
            const now = new Date();
            const msg = await Message.create({
                ...req.body,
                date: now.toISOString(),
                dateLisible: now.toLocaleString('fr-FR'),
                lu: false,
                repondu: false,
                important: false,
                categorie: req.body.categorie || 'autre'
            });
            res.status(201).json({ status: 'success', data: msg });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    getAll = async (req, res) => {
        try {
            const messages = await Message.find().sort({ createdAt: -1 });
            res.json({ status: 'success', data: messages });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    getById = async (req, res) => {
        try {
            const msg = await Message.findById(req.params.id);
            if (!msg) {
                return res.status(404).json({ status: 'error', message: 'Message non trouvé' });
            }
            res.json({ status: 'success', data: msg });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    markAsRead = async (req, res) => {
        try {
            const msg = await Message.findByIdAndUpdate(
                req.params.id,
                { lu: true },
                { new: true }
            );
            if (!msg) {
                return res.status(404).json({ status: 'error', message: 'Message non trouvé' });
            }
            res.json({ status: 'success', data: msg });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    delete = async (req, res) => {
        try {
            const msg = await Message.findByIdAndDelete(req.params.id);
            if (!msg) {
                return res.status(404).json({ status: 'error', message: 'Message non trouvé' });
            }
            res.json({ status: 'success' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    search = async (req, res) => {
        try {
            const q = req.query.q;
            if (!q) {
                return res.status(400).json({ status: 'error', message: 'Paramètre q requis' });
            }
            const messages = await Message.find({
                $or: [
                    { nom: { $regex: q, $options: 'i' } },
                    { sujet: { $regex: q, $options: 'i' } }
                ]
            });
            res.json({ status: 'success', data: messages });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };
}

module.exports = new ContactController();
