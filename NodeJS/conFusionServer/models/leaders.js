const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var LeaderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        required: true
    }
}, {
        timestamps: true
    });

var Leaders = mongoose.model('Leader', LeaderSchema);

module.exports = Leaders;