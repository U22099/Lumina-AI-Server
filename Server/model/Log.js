const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    method: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        expires: 604800
    }
});

module.exports = mongoose.model('Log', logSchema)
