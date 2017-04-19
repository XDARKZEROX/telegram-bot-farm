var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    moment = require('moment');
    emoji = require('node-emoji'),
    config = require('../../config/config'),
    async = require('async');
    userModel = require('../model/user')

module.exports = {

	searchProfile: function (codename, callback) {
        var IsProfileCreated = false;
        //Primero buscamos si el usuario posee un perfil creado o no.
        userModel.getUserByCodename(codename, function(response){
            if(response != undefined || response != null){
                IsProfileCreated = true;
            }
            callback(IsProfileCreated);
        });

		
	}



}