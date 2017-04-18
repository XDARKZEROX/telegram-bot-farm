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
        let text=`<b>Lista de cumplea\u00f1os ${emoji.get('cake')} : </b>\n\n`;
        let users;
        
        userModel.getAll(function(response){
            response.forEach(data => {
                text += `- ${data.name} ( ${moment(data.date).format('MMMM DD')} ) \n`; 
            })
            callback(text);
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
        
        let text = `<b>Bienvenid@ al bot de agenda Cumplea\u00f1era </b> \n\n` + 
        `A continuacion la lista de comandos de este bot: \n` + 
        `- /birthdays - Lista los cumpleaños de todos los registrados. \n` +  
        `- /today - Averigua quien o quienes cumplen el dia de hoy. \n \n` +
        `Si estás interesado en colaborar con el desarrollo de este bot, puedes visitar el repositorio en <a href="https://github.com/XDARKZEROX/telegram-bot-farm/">Github</a>`; 
        return text;
    },

    getBirthdayFromCodename : function(codename, callback) {
        let text = '';

        userModel.getUserByCodename(codename, function(response){
            if(response != undefined || response != null){
                console.log(response);
                text = ` lo encontre `; 
            } else {
                text = `No encontr\u00e9 a alguien con ese codename, prueba nuevamente.`
            }

           callback(text);
        });

       
    }

}

