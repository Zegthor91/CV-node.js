const CV = require('../models/CV');
const Message = require('../models/Message');

class AdminController {
    // --- DASHBOARD ---
    dashboard = async (req, res) => {
        try {
            const cv = await CV.findOne();
            const messageCount = await Message.countDocuments();
            const unreadCount = await Message.countDocuments({ lu: false });
            res.render('admin/dashboard', {
                title: 'Administration',
                cv,
                messageCount,
                unreadCount
            });
        } catch (error) {
            res.render('admin/dashboard', {
                title: 'Administration',
                cv: null,
                messageCount: 0,
                unreadCount: 0
            });
        }
    };

    // --- EXPERIENCES ---
    listExperiences = async (req, res) => {
        const cv = await CV.findOne();
        res.render('admin/experiences', {
            title: 'G\u00e9rer les Exp\u00e9riences',
            experiences: cv ? cv.experiences : []
        });
    };

    newExperienceForm = (req, res) => {
        res.render('admin/experience-new', { title: 'Ajouter une Exp\u00e9rience' });
    };

    createExperience = async (req, res) => {
        try {
            let cv = await CV.findOne();
            if (!cv) {
                req.session.flash = { type: 'error', message: 'CV non trouv\u00e9. Cr\u00e9ez d\'abord un CV.' };
                return res.redirect('/admin/experiences');
            }
            cv.experiences.push(req.body);
            await cv.save();
            req.session.flash = { type: 'success', message: 'Exp\u00e9rience ajout\u00e9e' };
            res.redirect('/admin/experiences');
        } catch (error) {
            req.session.flash = { type: 'error', message: error.message };
            res.redirect('/admin/experiences/new');
        }
    };

    deleteExperience = async (req, res) => {
        try {
            const cv = await CV.findOne();
            cv.experiences.pull({ _id: req.params.id });
            await cv.save();
            req.session.flash = { type: 'success', message: 'Exp\u00e9rience supprim\u00e9e' };
        } catch (error) {
            req.session.flash = { type: 'error', message: error.message };
        }
        res.redirect('/admin/experiences');
    };

    // --- FORMATIONS ---
    listFormations = async (req, res) => {
        const cv = await CV.findOne();
        res.render('admin/formations', {
            title: 'G\u00e9rer les Formations',
            formations: cv ? cv.formation : []
        });
    };

    newFormationForm = (req, res) => {
        res.render('admin/formation-new', { title: 'Ajouter une Formation' });
    };

    createFormation = async (req, res) => {
        try {
            let cv = await CV.findOne();
            if (!cv) {
                req.session.flash = { type: 'error', message: 'CV non trouv\u00e9. Cr\u00e9ez d\'abord un CV.' };
                return res.redirect('/admin/formations');
            }
            cv.formation.push(req.body);
            await cv.save();
            req.session.flash = { type: 'success', message: 'Formation ajout\u00e9e' };
            res.redirect('/admin/formations');
        } catch (error) {
            req.session.flash = { type: 'error', message: error.message };
            res.redirect('/admin/formations/new');
        }
    };

    deleteFormation = async (req, res) => {
        try {
            const cv = await CV.findOne();
            cv.formation.pull({ _id: req.params.id });
            await cv.save();
            req.session.flash = { type: 'success', message: 'Formation supprim\u00e9e' };
        } catch (error) {
            req.session.flash = { type: 'error', message: error.message };
        }
        res.redirect('/admin/formations');
    };

    // --- LOISIRS ---
    listLoisirs = async (req, res) => {
        const cv = await CV.findOne();
        res.render('admin/loisirs', {
            title: 'G\u00e9rer les Loisirs',
            loisirs: cv ? cv.loisirs : []
        });
    };

    newLoisirForm = (req, res) => {
        res.render('admin/loisir-new', { title: 'Ajouter un Loisir' });
    };

    createLoisir = async (req, res) => {
        try {
            let cv = await CV.findOne();
            if (!cv) {
                req.session.flash = { type: 'error', message: 'CV non trouv\u00e9. Cr\u00e9ez d\'abord un CV.' };
                return res.redirect('/admin/loisirs');
            }
            cv.loisirs.push(req.body.nom);
            await cv.save();
            req.session.flash = { type: 'success', message: 'Loisir ajout\u00e9' };
            res.redirect('/admin/loisirs');
        } catch (error) {
            req.session.flash = { type: 'error', message: error.message };
            res.redirect('/admin/loisirs/new');
        }
    };

    deleteLoisir = async (req, res) => {
        try {
            const cv = await CV.findOne();
            const index = parseInt(req.params.id);
            if (cv && index >= 0 && index < cv.loisirs.length) {
                cv.loisirs.splice(index, 1);
                await cv.save();
                req.session.flash = { type: 'success', message: 'Loisir supprim\u00e9' };
            }
        } catch (error) {
            req.session.flash = { type: 'error', message: error.message };
        }
        res.redirect('/admin/loisirs');
    };

    // --- MESSAGES ---
    listMessages = async (req, res) => {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.render('admin/messages', {
            title: 'Messages',
            messages
        });
    };

    markMessageRead = async (req, res) => {
        await Message.findByIdAndUpdate(req.params.id, { lu: true });
        res.redirect('/admin/messages');
    };

    deleteMessage = async (req, res) => {
        await Message.findByIdAndDelete(req.params.id);
        req.session.flash = { type: 'success', message: 'Message supprim\u00e9' };
        res.redirect('/admin/messages');
    };
}

module.exports = new AdminController();
