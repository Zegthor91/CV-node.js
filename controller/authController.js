const User = require('../models/User');

class AuthController {
    showLogin = (req, res) => {
        res.render('auth/login', { title: 'Connexion' });
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                req.session.flash = { type: 'error', message: 'Email et mot de passe requis' };
                return res.redirect('/login');
            }

            const user = await User.findOne({ email });
            if (!user || !user.password) {
                req.session.flash = { type: 'error', message: 'Email ou mot de passe incorrect' };
                return res.redirect('/login');
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                req.session.flash = { type: 'error', message: 'Email ou mot de passe incorrect' };
                return res.redirect('/login');
            }

            req.session.userId = user._id;
            req.session.userEmail = user.email;
            req.session.userName = user.prenom + ' ' + user.nom;

            req.session.flash = { type: 'success', message: 'Connexion r\u00e9ussie !' };
            res.redirect('/admin');
        } catch (error) {
            req.session.flash = { type: 'error', message: 'Erreur lors de la connexion' };
            res.redirect('/login');
        }
    };

    showRegister = (req, res) => {
        res.render('auth/register', { title: 'Inscription' });
    };

    register = async (req, res) => {
        try {
            const { nom, prenom, email, password, confirmPassword } = req.body;

            if (!nom || !prenom || !email || !password) {
                req.session.flash = { type: 'error', message: 'Tous les champs sont requis' };
                return res.redirect('/register');
            }

            if (password !== confirmPassword) {
                req.session.flash = { type: 'error', message: 'Les mots de passe ne correspondent pas' };
                return res.redirect('/register');
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.session.flash = { type: 'error', message: 'Cet email est d\u00e9j\u00e0 utilis\u00e9' };
                return res.redirect('/register');
            }

            const user = await User.create({ nom, prenom, email, password });

            req.session.userId = user._id;
            req.session.userEmail = user.email;
            req.session.userName = user.prenom + ' ' + user.nom;

            req.session.flash = { type: 'success', message: 'Inscription r\u00e9ussie !' };
            res.redirect('/admin');
        } catch (error) {
            req.session.flash = { type: 'error', message: "Erreur lors de l'inscription" };
            res.redirect('/register');
        }
    };

    logout = (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    };
}

module.exports = new AuthController();
