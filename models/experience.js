const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
    {
        titre: {type: String, required: true},
        company: {type: String, required: true},
        startDate: {type: String, default: ''},
        endDate: {type: String, default: ''},
        description: {type: String, default: ''},
        order: {type: Number, default: 0},

    },
    { timestamps: true}
);

module.exports = mongoose.model('Experience', experienceSchema);