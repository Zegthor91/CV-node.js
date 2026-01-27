const fileStore = require('../utils/fileStore');

class ContactController {
    constructor() {
        this.store = fileStore;
    }

    create = (req, res) => {
        const msg = this.store.add('messages', { ...req.body, date: new Date().toISOString(), lu: false });
        res.status(201).json({ status: 'success', data: msg });
    };

    getAll = (req, res) => res.json({ status: 'success', data: this.store.findAll('messages') });

    getById = (req, res) => res.json({ status: 'success', data: this.store.findById('messages', req.params.id) });

    markAsRead = (req, res) => {
        const msg = this.store.update('messages', req.params.id, { lu: true });
        res.json({ status: 'success', data: msg });
    };

    delete = (req, res) => {
        this.store.delete('messages', req.params.id);
        res.json({ status: 'success' });
    };

    search = (req, res) => {
        const q = req.query.q?.toLowerCase();
        const results = this.store.search('messages', m => m.nom.toLowerCase().includes(q) || m.sujet.toLowerCase().includes(q));
        res.json({ status: 'success', data: results });
    };
}

module.exports = new ContactController();
