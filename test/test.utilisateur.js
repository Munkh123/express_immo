require('../config/connexionMongoDB');
require('../models/Utilisateur');
const assert = require('assert');
const mongoose = require('mongoose');
const Utilisateur = mongoose.model('Utilisateur');

describe('Utilisateur', function() {
    before(function(done) {
        mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        mongoose.connection
            .on('open', () => {
                console.log('Connection à Mongoose établi');
            })
            .on('error', (err) => {
                console.log(`Erreur lors de la connection: ${err.message}`);
            });
        done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function(done) {
        const utilisateur = new Utilisateur({
            username: 'clement',
            email: 'clement@gmail.com',
            password: 'passadmin',
            agent: true
        });

        utilisateur.save()
            .then(() => { done(); })
            .catch((err) => {
                console.log(err);
            });
    });

    it('Recherche d\'un utilisateur par son email', function(done) {
        Utilisateur.findOne({ username : 'clement'})
            .then((utilisateurs) => {
                assert.equal(utilisateurs.email, 'clement@gmail.com');
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Vérification qu\'un utilisateur est un agent', function(done) {
        Utilisateur.findOne({ username : 'clement'})
            .then((utilisateurs) => {
                assert.equal(utilisateurs.agent, true);
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Vérification qu\'un utilisateur est un agent', function(done) {
        Utilisateur.findOne({ username : 'clement'})
            .then((utilisateur) => {
                assert.equal(utilisateur.agent, true);
                done();
            })
            .catch((err) => { console.log(err); });
    });

    afterEach(function(done) {
        Utilisateur.deleteMany({ username : 'clement'}, function() {
            done();
        });
    });

});