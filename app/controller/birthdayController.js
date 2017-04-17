var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    moment = require('moment');
    emoji = require('node-emoji'),
    config = require('../../config/config'),
    async = require('async');
    userModel = require('../model/user')

module.exports = {
    // Obtienes toda la lista de cumpleaños!
    getBirthdays : function(callback){
        //Antes cargaba de un archivo plano
        //var birthdays = JSON.parse(fs.readFileSync('public/resources/birthdays.json', 'utf8'));
        var text=`<b>Lista de cumplea\u00f1os ${emoji.get('cake')} : </b>\n\n`;
        var users;
        userModel.getAll(function(response){
            response.forEach(data => {
                text += `- ${data.name} ( ${moment(data.date).format('MMMM DD')} ) \n`; 
            })
            callback(text);
        });
    },

    getBirthdayToday: function(req, res) {
        var birthdays = JSON.parse(fs.readFileSync('public/resources/birthdays.json', 'utf8'));
        var systemDate  = moment().format('DD-MM');
        var birthdaysToday = [];
        birthdays['birthdays'].forEach(function(item, index) {
            if(systemDate===moment(item.date).format('DD-MM')){
                birthdaysToday.push(item);
            }
        });
        res.send(response);
   },

   getHelp: function() {
        
        var text = `<b>Bienvenid@ al bot de agenda Cumplea\u00f1era </b> \n\n` + 
        `A continuacion la lista de comandos de este bot: \n` + 
        `- /birthdays - Lista los cumpleaños de todos los registrados. \n` +  
        `- /today - Averigua quien o quienes cumplen el dia de hoy. \n \n` +
        `Si estás interesado en colaborar con el desarrollo de este bot, puedes visitar el repositorio en <a href="https://github.com/XDARKZEROX/telegram-bot-farm/">Github</a>`; 
        
        return text;
    },

    getBirthdayFromCodeName(codename) {





    }

}

