require('dotenv').config();
require('../models/Annonce');
require('../models/Utilisateur');
const app = require('../app');
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

mongoose.connect('mongodblink', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const server = app.listen(3000, () => {
    console.log(`App sur port : ${server.address().port}`);
});