const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Utilisateur = mongoose.model('Utilisateur');

//page s'inscrire
router.get('/', (req, res) => {
    const auth = req.session.isAuth;
    const username = req.session.username;
    const agent = req.session.agent;
    const url = "/";
    const page = "enregistrer";
    const error = req.session.error;
    delete req.session.error;

    if(auth)
        res.redirect("/");
    res.render("enregistrer", { err: error, auth, username, agent, url, page });
});

//créer le compte
router.post('/', async(req, res) => {
    const errors = validationResult(req);
    //utilisateur existe deja
    if(await Utilisateur.findOne({username: req.body.username})) {
      req.session.error = "Le nom d'utilisateur existe déjà";
      return res.redirect("/enregistrer");
    }
    //email existe deja
    if(await Utilisateur.findOne({email: req.body.email})) {
        req.session.error = "L'email existe déjà";
        return res.redirect("/enregistrer");
    }
    //cryptage mdp
    const generatedString = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, generatedString);

    if (errors.isEmpty()){
        const user = new Utilisateur(req.body);
        user.save()
            .then(() => { res.redirect('/valider'); })
            .catch((err) => {
                res.send('Erreur de la création du compte');
            });
    }else{
        res.render('enregistrer', {
            title: 'S`enregistrer',
            errors: errors.array(),
            data: req.body,
        });
    }
});

module.exports = router;