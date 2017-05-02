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
        //Primero buscamos si el usuario posee un perfil creado o no.
        userModel.getUserByCodename(codename, function(response){
            if(response != undefined || response != null){
                callback({
                    status: true,
                    data : response
                });
            } else {
                callback({
                    status: false,
                    data : null
                });
            }
        });
    },

    updateName: function (codename, newName, callback ) {
        //Procedemos a actualizar el registro en la tabla
        userModel.updateNameFromCodename(codename, newName, function () {
        });
    },

    saveAgent: function(agent, callback) {
        userModel.save(agent, function (response) {
            console.log(response);
        });

    }
}