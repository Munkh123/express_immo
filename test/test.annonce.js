require('../config/connexionMongoDB');
require('../models/Annonce');
const assert = require('assert');

const mongoose = require('mongoose');
const Annonce = mongoose.model('Annonce');
const Commentaire = mongoose.model('Commentaire');

describe('Annonce', function() {
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
        const annonce = new Annonce({
            auteur: 'clem',
            titre: 'Appartement à louer en centre-ville Le Havre',
            type: 'Location',
            statut: 'Publié',
            statutBien: 'Disponible',
            description: 'Sublime appartement de 90 m² à louer',
            prix: '1500',
            photos: ['test_annonce1.jpeg', 'test_annonce2.jpeg']
        });

        annonce.save()
            .then(() => {})
            .catch((err) => {
                console.log(err);
            });

        const annonce2 = new Annonce({
            auteur: 'munkhdorj',
            titre: 'Maison à vendre en campagne en montagne',
            type: 'Vente',
            statut: 'Publié',
            statutBien: 'Disponible',
            description: 'Maison de 200 m² à vendre',
            prix: '20000',
            commenaires:[]
        });

        annonce2.save()
            .then(() => { done(); })
            .catch((err) => {
                console.log(err);
            });

        const commentaire = Commentaire.create({
            auteur: 'munkhdorj',
            text: 'Bonjour, puis je savoir en quelle année la maison a été établi ?',
            agent: false,
            Annonce: annonce._id
        })

        const commentaire2 = Commentaire.create({
            auteur: 'clem',
            text: 'Bonjour munkhdorj, \nla maison a était construite en 1997. \n\nCordialement, \Clement',
            agent: true,
            Annonce: annonce2._id
        })

        Annonce.updateOne({_id: annonce._id},{$set: {
                commentaires: commentaire, commentaire2
            }}
        );

    });

    it('Auteur de l\'annonce', function(done) {
        Annonce.findOne({ titre: 'Appartement à louer en centre-ville Le Havre' })
            .then((Annonces) => {
                assert.equal(Annonces.auteur, 'clem');
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Type de l\'annonce', function(done) {
        Annonce.findOne({ titre: 'Appartement à louer en centre-ville Le Havre' })
            .then((Annonces) => {
                assert.equal(Annonces.type, 'Location');
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Publication statut de l\'annonce', function(done) {
        Annonce.findOne({ titre: 'Appartement à louer en centre-ville Le Havre' })
            .then((Annonces) => {
                assert.equal(Annonces.statut, 'Publié');
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Statut de l\'annonce', function(done) {
        Annonce.findOne({ titre: 'Appartement à louer en centre-ville Le Havre' })
            .then((Annonces) => {
                assert.equal(Annonces.statutBien, 'Disponible');
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Description de l\'annonce', function(done) {
        Annonce.findOne({ titre: 'Appartement à louer en centre-ville Le Havre' })
            .then((Annonces) => {
                assert.equal(Annonces.description, 'Sublime appartement de 90 m² à louer');
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Prix de l\'annonce', function(done) {
        Annonce.findOne({ titre: 'Appartement à louer en centre-ville Le Havre' })
            .then((Annonces) => {
                assert.equal(Annonces.prix, '1500');
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Auteur de l\'annonce', function(done) {
        Annonce.find({ auteur: 'clem' })
            .then((Annonces) => {
                assert.equal(Annonces[0].titre, 'Appartement à louer en centre-ville Le Havre');
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Photo(s) de l\'annonce', function(done) {
        Annonce.findOne({ titre: 'Appartement à louer en centre-ville Le Havre' })
            .then((Annonces) => {
                assert.equal(Annonces.photos[0], 'test_annonce1.jpeg');
                assert.equal(Annonces.photos[1], 'test_annonce2.jpeg');
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Commentaire d\'un visiteur', function(done) {
        Commentaire.find( {auteur: 'munkhdorj'})
            .then((commentaires) => {
                assert.equal(commentaires[0].text, 'Bonjour, puis je savoir en quelle année la maison a été établi ?');
                assert.equal(commentaires[0].auteur, 'munkhdorj');
                assert.equal(commentaires[0].agent, false);
                done();
            })
            .catch((err) => { console.log(err); });
    });

    it('Commentaire d\'un agent', function(done) {
        Commentaire.find( {auteur: 'clem'})
            .then((commentaires) => {
                assert.equal(commentaires[0].text, 'Bonjour munkhdorj, \nla maison a était construite en 1997. \n\nCordialement, \Clement');
                assert.equal(commentaires[0].auteur, 'clem');
                assert.equal(commentaires[0].agent, true);
                done();
            })
            .catch((err) => { console.log(err); });
    });

    afterEach(function(done) {
        Annonce.deleteOne({auteur:'munkhdorj'}, function () {
            done();
        })
    });

    afterEach(function(done) {
        Annonce.deleteMany({}, function () {
            done();
        })
    });
});