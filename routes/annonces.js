const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const upload = require('./chargerImage');
const Annonce = mongoose.model('Annonce');
const Commentaire = mongoose.model('Commentaire');
const auth = require('./authentification');

//Récupérer les annonces
router.get('/', (req, res) => {
    const agent = req.session.agent;
    const username = req.session.username;
    const auth = req.session.isAuth;
    const url = "/";
    const page = "annonces";

    Annonce.find()
        .then((annonces) => {
            res.render('annonces', { titre: 'Annonces', annonces, agent, auth, username, url, page });
        })
        .catch(() => { res.send('Erreur de récupération des annonces'); });
});

//Récupérer les détails d'une annonce
router.get('/:id', async(req, res) => {
    try {
        const annonceId = await Annonce.findById(req.params.id).populate('commentaires');
        const commentaireId = await Commentaire.find({ annonce: annonceId.id});
        const auth = req.session.isAuth;
        const username = req.session.username;
        const agent = req.session.agent;
        const url = "../";
        const page = "annonceId";

        res.render('annonceId', { title:'Annonce', annonceId, commentaireId, agent, auth, username, url, page });
    } catch(err) {res.send('Erreur de récupération de l\'annonce');}
});

//Supprimer
router.post('/supprimer/:id', auth, async(req, res) => {
    try {
        await Annonce.deleteOne({_id: req.params.id});
        await Commentaire.deleteMany({ annonce: req.params.id });
        res.redirect('/annonces');
    } catch (err) {
        res.send('Erreur de suppression de l\'annonce');
    }
});

//page de modification 'une annonce
router.get('/modifier/:id/', auth, async(req, res) => {
    try {
        const annonceId = await Annonce.findById(req.params.id);
        const auth = req.session.isAuth;
        const username = req.session.username;
        const agent = req.session.agent;
        const url = "../../";
        const page = "modifier";
        const dateDebut = annonceId.dateDebut.toISOString().split('T')[0];
        const dateFin = annonceId.dateFin.toISOString().split('T')[0];

        res.render('modifier', { title: 'Modifier', annonceId, auth, username, agent, url, page, dateDebut, dateFin });
    } catch(err) {
        res.send('Erreur d`accès à la page de modification');
    }
});

//Maj une annonce
router.post('/modifier/:id/', auth, async(req, res) => {
    try {
        await upload(req, res);
        const annonceId = await Annonce.findById(req.params.id);
        const photoActuel = annonceId.photos;
        let photoNouvelle;

        if(req.files.length)
            photoNouvelle = req.files.map(function(file) { return file.filename; });
        else
            photoNouvelle = photoActuel;

        await Annonce.updateOne({_id: req.params.id},{$set: {
                titre: req.body.titre,
                description: req.body.description,
                statut: req.body.statut,
                statutBien: req.body.statutBien,
                type: req.body.type,
                prix: req.body.prix,
                dateDebut: req.body.dateDebut,
                dateFin: req.body.dateFin,
                photos: photoNouvelle
            }
        });

        res.redirect(`/annonces/${annonceId._id}`);
    } catch (err) {
         res.send(`Erreur de modification de l'annonce`);
    }
});

//Laisser un commentaire
router.post('/commentaire/:id', async(req, res) => {
    try {
        const annonceId = await Annonce.findById(req.params.id).populate('commentaires');
        let listComs = annonceId.commentaires;
        const commentaire = await Commentaire.create({
            auteur: req.session.username,
            text: req.body.commentaire,
            agent: req.session.agent,
            annonce: annonceId._id
        })
        listComs.push(commentaire);
        await Annonce.updateOne({_id: req.params.id},{$set: {commentaires: listComs}}
        );
        res.redirect(`/annonces/${annonceId._id}`);
    } catch (err) {
        res.send(`Erreur de création d'un commentaire`);
    }
});

module.exports = router;