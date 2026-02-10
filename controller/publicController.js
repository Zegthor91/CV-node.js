const Profile = require('../models/profile');
const Experience = require('../models/experience');
const Formation = require('../models/formation');
const Hobby = require('../models/hobby');
const Message = require('../models/Message');

// Profil par défaut si aucun en base
const defaultProfile = {
    fullName: 'Votre Nom',
    headline: 'Développeur / Data / Gestion de projet',
    photo: 'https://picsum.photos/300/300',
    summary: "Résumé professionnel (à personnaliser dans l'espace Admin).",
    email: 'email@example.com',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
};

// Helper pour charger les données de base (profile)
const loadBaseData = async () => {
    const profileFromDb = await Profile.findOne().lean();
    const profile = profileFromDb ? profileFromDb : defaultProfile;
    return { profile };
};

class PublicController {
    // Page d'accueil
    home = async (req, res, next) => {
        try {
            const { profile } = await loadBaseData();
            const experiences = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();
            const formations = await Formation.find().sort({ order: 1, createdAt: -1 }).lean();
            const hobbies = await Hobby.find().sort({ order: 1, createdAt: -1 }).lean();
            res.render('public/home', { title: 'Accueil', profile, experiences, formations, hobbies });
        } catch (err) {
            next(err);
        }
    };

    // Page expériences
    experience = async (req, res, next) => {
        try {
            const { profile } = await loadBaseData();
            const experiences = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();
            res.render('public/experience', { title: 'Expériences', profile, experiences });
        } catch (err) {
            next(err);
        }
    };

    // Page formations
    formation = async (req, res, next) => {
        try {
            const { profile } = await loadBaseData();
            const formations = await Formation.find().sort({ order: 1, createdAt: -1 }).lean();
            res.render('public/formation', { title: 'Formation', profile, formations });
        } catch (err) {
            next(err);
        }
    };

    // Page loisirs
    loisirs = async (req, res, next) => {
        try {
            const { profile } = await loadBaseData();
            const hobbies = await Hobby.find().sort({ order: 1, createdAt: -1 }).lean();
            res.render('public/loisirs', { title: 'Loisirs', profile, hobbies });
        } catch (err) {
            next(err);
        }
    };

    // Page contact (GET)
    showContact = async (req, res, next) => {
        try {
            const { profile } = await loadBaseData();
            res.render('public/contact', { title: 'Contact', profile, form: {}, success: null, error: null });
        } catch (err) {
            next(err);
        }
    };

    // Page contact (POST)
    submitContact = async (req, res, next) => {
        try {
            const { profile } = await loadBaseData();
            const { name, email, message } = req.body;

            if (!name || !email || !message) {
                return res.status(400).render('public/contact', {
                    title: 'Contact',
                    profile,
                    form: { name, email, message },
                    success: null,
                    error: 'Merci de remplir tous les champs.'
                });
            }

            await Message.create({
                nom: name,
                email,
                message,
                sujet: 'Message depuis le formulaire de contact',
                date: new Date().toISOString(),
                dateLisible: new Date().toLocaleString('fr-FR'),
                lu: false,
                repondu: false
            });

            return res.render('public/contact', {
                title: 'Contact',
                profile,
                form: {},
                success: 'Message envoyé. Merci, nous vous répondrons dès que possible.',
                error: null
            });
        } catch (err) {
            next(err);
        }
    };
}

module.exports = new PublicController();
