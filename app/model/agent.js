'use strict';

var mongoose = require('mongoose');
var config = require('../../config/database');

mongoose.Promise = global.Promise;

mongoose.connect(config.mongodb.uri_prod,
    {
        useMongoClient: true
    })
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));

var AgentSchema = new mongoose.Schema({
    codename: String,
    date: String,
    name: String
}, { collection: 'birthdays' });

module.exports = mongoose.model('Agent', AgentSchema);

