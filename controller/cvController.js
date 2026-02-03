const path = require('path');
const CV = require('../models/CV');

class CVController {
    render = (req, res) => res.sendFile(path.join(__dirname, '../cv/views/index.html'));

    getAll = async (req, res) => {
        try {
            const cv = await CV.findOne();
            res.json({ status: 'success', data: cv });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    update = async (req, res) => {
        try {
            const cv = await CV.findOneAndUpdate({}, req.body, {
                new: true,
                runValidators: true,
                upsert: true
            });
            res.json({ status: 'success', data: cv });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    addExperience = async (req, res) => {
        try {
            const cv = await CV.findOne();
            if (!cv) {
                return res.status(404).json({ status: 'error', message: 'CV non trouvé' });
            }
            cv.experiences.push(req.body);
            await cv.save();
            const newExp = cv.experiences[cv.experiences.length - 1];
            res.status(201).json({ status: 'success', data: newExp });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };

    deleteExperience = async (req, res) => {
        try {
            const cv = await CV.findOne();
            if (!cv) {
                return res.status(404).json({ status: 'error', message: 'CV non trouvé' });
            }
            cv.experiences.pull({ _id: req.params.id });
            await cv.save();
            res.json({ status: 'success' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    };
}

module.exports = new CVController();
