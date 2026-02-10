const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        headline: { type: String, default: '' },
        photo: { type: String, default: '' },
        summary: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        website: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
