const express = require('express');
const router = express.Router();

//page validation requete
router.get('/', function(req, res) {
    const auth = req.session.isAuth;
    const username = req.session.username;
    const agent = req.session.agent;
    const url = "/";
    const page = "valider";
    res.render('valider', { title: 'Success', auth, username, agent, url, page });
});

module.exports = router;