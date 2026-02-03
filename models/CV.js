const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    poste: { type: String, required: true },
    periode: { type: String },
    description: { type: String }
}, { _id: true });

const formationSchema = new mongoose.Schema({
    etablissement: { type: String, required: true },
    localisation: { type: String },
    periode: { type: String },
    diplome: { type: String },
    description: { type: String }
}, { _id: true });

const competenceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    niveau: { type: String, required: true }
}, { _id: true });

const langueSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    niveau: { type: String, required: true }
}, { _id: false });

const reseauxSchema = new mongoose.Schema({
    github: { type: String },
    linkedin: { type: String }
}, { _id: false });

const cvSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    titre: { type: String },
    localisation: { type: String },
    email: { type: String },
    telephone: { type: String },
    profil: { type: String },
    experiences: [experienceSchema],
    formation: [formationSchema],
    competences: [competenceSchema],
    langues: [langueSchema],
    loisirs: [{ type: String }],
    reseaux: reseauxSchema
}, { timestamps: true });

module.exports = mongoose.model('CV', cvSchema);
