const path = require('path');
const fileStore = require('../utils/fileStore');

class CVController {
    constructor() {
        this.store = fileStore;
    }

    render = (req, res) => res.sendFile(path.join(__dirname, '../cv/views/index.html'));

    getAll = (req, res) => res.json({ status: 'success', data: this.store.read('cv') });

    update = (req, res) => {
        const cv = { ...this.store.read('cv'), ...req.body };
        this.store.write('cv', cv);
        res.json({ status: 'success', data: cv });
    };

    addExperience = (req, res) => {
        const cv = this.store.read('cv');
        const exp = { id: Date.now(), ...req.body };
        cv.experiences.push(exp);
        this.store.write('cv', cv);
        res.status(201).json({ status: 'success', data: exp });
    };

    deleteExperience = (req, res) => {
        const cv = this.store.read('cv');
        cv.experiences = cv.experiences.filter(e => e.id !== parseInt(req.params.id));
        this.store.write('cv', cv);
        res.json({ status: 'success' });
    };
}

module.exports = new CVController();
