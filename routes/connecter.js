const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Utilisateur = mongoose.model('Utilisateur');

//page connexion
router.get('/', (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    const auth = req.session.isAuth;
    const username = req.session.username;
    const agent = req.session.agent;
    const url = "/";
    const page = "connecter"

    if(auth)
        res.redirect("/");
    res.render("connecter", { err: error, auth, username, agent, url, page });
});

//Connecter à un compte
router.post('/', async(req, res) => {
    const utilisateur = await Utilisateur.findOne({username: req.body.username});
    if(!utilisateur) {
        req.session.error = "Nom d'utilisateur ou mot de passe invalide";
        return res.redirect("/connecter");
    }
    const mdp = await bcrypt.compare(req.body.password, utilisateur.password);
    if(!mdp){
        req.session.error = "Nom d'utilisateur ou mot de passe invalide";
        return res.redirect("/connecter");
    }
    req.session.cookie.expires = new Date(Date.now() + 3600000);
    req.session.agent = !!utilisateur.agent;
    req.session.username = utilisateur.username;
    req.session.isAuth = true;
    res.redirect('/');
});

//Déconnecter
router.post('/deconnecter', async(req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/connecter");
    });
});

module.exports = router;