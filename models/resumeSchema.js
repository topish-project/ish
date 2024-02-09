const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resumeSchema = new Schema({
    summary: {
        type: String,
        default: ''
    },
    industry: { type: Array, default: [] },
    contact: {
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
    },
    workExperience: { type: Array, default: [] },
    education: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    certificates: { type: Array, default: [] },
    awards: { type: Array, default: [] },
    languages: { type: Array, default: [] },
    cv: {
        type: Object,
        default: {
            path: '',
            filename: '',
            size: '',
            key: ''
        }
    },

}, { timestamps: true });
// Create a model if you haven't already

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume


