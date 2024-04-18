const express = require('express');
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require('path');
const indexRoute = require('./routes/index');
const formulaireRoute = require('./routes/formulaire');
const annoncesRoute = require('./routes/annonces');
const validerRoute = require('./routes/valider');
const connecter = require('./routes/connecter');
const inscrire = require('./routes/inscrire');
const authRoute = require('./routes/authentification');

const app = express();
const store = new MongoDBStore({
    uri: 'mongodblink',
    collection: "sessions",
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/css/'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use('/', indexRoute);
app.use('/formulaire', formulaireRoute);
app.use('/annonces', annoncesRoute);
app.use('/valider', validerRoute);
app.use('/enregistrer', inscrire);
app.use('/connecter', connecter);
app.use('/authentification', authRoute);

module.exports = app;