const mongoose = require("mongoose");

const UtilisateurSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    agent: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);