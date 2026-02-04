function requireAuth(req, res, next) {
    if (req.session && req.session.userId) return next();
    return res.redirect('/login');
}

function addUserToLocals(req, res, next) {
    res.locals.isAuthenticated = Boolean(req.session && req.session.userId);
    res.locals.userEmail = req.session && req.session.userEmail ? req.session.userEmail : null;
    next();
}

module.exports = {requireAuth, addUserToLocals};