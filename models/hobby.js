const mongoose = require('mongoose');

const hobbySchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        details: {type: String, default: ''},
        order: {type: Number, default: 0}
    },
    { timestamps: true }
);

module.exports = mongoose.model('Hobby', hobbySchema);