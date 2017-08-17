const 
express = require('express'),
router = express.Router(),
fs = require('fs'),
moment = require('moment');
emoji = require('node-emoji'),
config = require('../../config/config'),
async = require('async');
userModel = require('../model/user')

module.exports = {

	searchProfile: (codename, callback) => {
        //Primero buscamos si el usuario posee un perfil creado o no.
        userModel.getUserByCodename(codename, response => {
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

    updateName: (codename, newName, callback) =>  {
        //Procedemos a actualizar el registro en la tabla
        userModel.updateNameFromCodename(codename, newName, () => {
            // TODO
        });
    },

    saveAgent: (agent, callback) => {
        userModel.save(agent, (response) => {
            console.log(response);
        });
    },

    updateDate: (codename, newDate, callback) => {
        //Procedemos a actualizar el registro en la tabla
        userModel.updateDateFromCodename(codename, newDate, (rs) => {
            // TODO
        });
    },
}