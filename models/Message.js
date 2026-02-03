const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, default: '' },
    email: { type: String, required: true },
    telephone: { type: String, default: '' },
    sujet: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String },
    dateLisible: { type: String },
    lu: { type: Boolean, default: false },
    repondu: { type: Boolean, default: false },
    important: { type: Boolean, default: false },
    categorie: { type: String, default: 'autre' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
