const CV = require('../models/CV');
const Message = require('../models/Message');

class PageController {
    home = async (req, res) => {
        try {
            const cv = await CV.findOne();
            res.render('pages/home', { title: 'Accueil - CV', cv });
        } catch (error) {
            res.status(500).render('pages/home', { title: 'Accueil', cv: null });
        }
    };

    experience = async (req, res) => {
        try {
            const cv = await CV.findOne();
            res.render('pages/experience', {
                title: 'Exp\u00e9riences',
                experiences: cv ? cv.experiences : []
            });
        } catch (error) {
            res.status(500).render('pages/experience', {
                title: 'Exp\u00e9riences',
                experiences: []
            });
        }
    };

    formation = async (req, res) => {
        try {
            const cv = await CV.findOne();
            res.render('pages/formation', {
                title: 'Formation',
                formations: cv ? cv.formation : []
            });
        } catch (error) {
            res.status(500).render('pages/formation', {
                title: 'Formation',
                formations: []
            });
        }
    };

    loisirs = async (req, res) => {
        try {
            const cv = await CV.findOne();
            res.render('pages/loisirs', {
                title: 'Loisirs',
                loisirs: cv ? cv.loisirs : []
            });
        } catch (error) {
            res.status(500).render('pages/loisirs', {
                title: 'Loisirs',
                loisirs: []
            });
        }
    };

    showContact = (req, res) => {
        res.render('pages/contact', { title: 'Contact' });
    };

    submitContact = async (req, res) => {
        try {
            const now = new Date();
            await Message.create({
                ...req.body,
                date: now.toISOString(),
                dateLisible: now.toLocaleString('fr-FR'),
                lu: false,
                repondu: false,
                important: false,
                categorie: req.body.categorie || 'autre'
            });
            req.session.flash = { type: 'success', message: 'Message envoy\u00e9 avec succ\u00e8s !' };
            res.redirect('/contact');
        } catch (error) {
            req.session.flash = { type: 'error', message: "Erreur lors de l'envoi du message" };
            res.redirect('/contact');
        }
    };
}

module.exports = new PageController();
