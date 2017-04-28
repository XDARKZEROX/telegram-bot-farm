var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    moment = require('moment'),
    emoji = require('node-emoji'),
    config = require('../../config/config'),
    async = require('async'),
    userModel = require('../model/user')

module.exports = {
    // Obtienes toda la lista de cumpleaños!
    getBirthdays : function(callback){
        //Antes cargaba de un archivo plano
        //var birthdays = JSON.parse(fs.readFileSync('public/resources/birthdays.json', 'utf8'));
        let message=`<b>Lista de cumplea\u00f1os ${emoji.get('cake')} : </b>\n\n`;
        userModel.getAll(function(response){
            if(response!= null || response!= undefined){
                for (var key in response) {
                    message += `- ${response[key].name} ( ${moment(response[key].date).format('MMMM DD')} ) \n`;
                }
                callback(message);
            }
            else {
                callback('Parece que no tengo registros todavia.');
            }
        });
    },

    getBirthdayToday: function(req, res) {
        let birthdays = JSON.parse(fs.readFileSync('public/resources/birthdays.json', 'utf8'));
        let systemDate  = moment().format('DD-MM');
        let birthdaysToday = [];
        birthdays['birthdays'].forEach(function(item, index) {
            if(systemDate===moment(item.date).format('DD-MM')){
                birthdaysToday.push(item);
            }
        });
        res.send(response);
   },

   getHelp: function() {
        let message = `<b>Bienvenid@ al bot de agenda Cumplea\u00f1era </b> \n\n` +
        `A continuaci\u00f3n la lista de comandos de este bot: \n` +
        `- /birthdays - Lista los cumpleaños de todos los registrados. \n` +  
        `- /today - Averigua quien o quienes cumplen el dia de hoy. \n \n` +
        `Si estás interesado en colaborar con el desarrollo de este bot, puedes visitar el repositorio en <a href="https://github.com/XDARKZEROX/telegram-bot-farm/">Github</a>`; 
        return message;
    },

    getBirthdayFromCodename : function(codename, callback) {
        let message = '';

        userModel.getUserByCodename(codename, function(response){
            if(response != undefined || response != null){
                message = ` ${response.name} (@${response.codename.toUpperCase()}), Fecha de Nacimiento: ${response.date}  `;
            } else {
                message = `No encontr\u00e9 a alguien con ese codename, prueba nuevamente.`
            }
            callback(message);
        });
    }
}
