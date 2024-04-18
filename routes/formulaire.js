const express = require('express');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const router = express.Router();
const auth = require('./authentification');
const upload = require('./chargerImage');
const Annonce = mongoose.model('Annonce');


//Afficher formulaire
router.get('/', auth, (req, res) => {
    const auth = req.session.isAuth;
    const username = req.session.username;
    const agent = req.session.agent;
    const url = "/";
    const page = "formulaire";
    res.render('formulaire', { title: 'Formulaire', auth, username, agent, url, page });
});

//Créer l'annonce
router.post('/', async(req, res) => {
    try {
        const errors = validationResult(req);
        await upload(req, res);

        if (errors.isEmpty()) {
            const listFichiers = req.files.map(function(file) {return file.filename;});
            req.body.auteur = req.session.username;
            req.body.photos = listFichiers;
            const annonceAcreer = new Annonce(req.body);
            annonceAcreer.save()
            .then(() => { res.redirect('/valider'); })
            .catch((err) => {
                res.send('Erreur de création de l\'annonce');
            });
        }else{
            res.render('formulaire', {
                data: req.body,
            }); 
        }
     
        }catch (error) {
         res.send(`Erreur de création`);
        }
});

module.exports = router;
