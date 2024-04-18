const mongoose = require("mongoose");

const AnnonceSchema = new mongoose.Schema({
    auteur: {
        type: String,
        required: true
    },
    titre: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        required: true
    },
    statutBien: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    dateDebut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateFin: {
        type: Date,
        default: Date.now,
        required: true
    },
    photos: {
        type: [String]
    },
    commentaires: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Commentaire"
        }
    ]
})

const CommentaireSchema = new mongoose.Schema({
    auteur: String,
    text: String,
    agent: Boolean,
    date: {type: Date, default: Date.now},
    annonce: [{ type: mongoose.Schema.Types.ObjectId, ref: "Annonce"}]
})

module.exports = mongoose.model('Commentaire', CommentaireSchema);
module.exports = mongoose.model('Annonce', AnnonceSchema);