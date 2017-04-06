var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    moment = require('moment');
    emoji = require('node-emoji'),
    firebase = require('firebase'),
    config = require('../../config/config')

firebase.initializeApp(config.firebase);

module.exports = {
    // Obtienes toda la lista de cumpleaños!
    getBirthdays : function(callback){
        //Antes cargaba de un archivo plano
        //var birthdays = JSON.parse(fs.readFileSync('public/resources/birthdays.json', 'utf8'));
        var text=`<b>Lista de cumplea\u00f1os ${emoji.get('cake')} : </b>\n\n`;
        var birthdays = firebase.database().ref().child("birthdays");
        birthdays.on('value', (snap) => {
            snap.forEach((child) => {
                text += `- ${child.val().name} ( ${moment(child.val().date).format('MMMM DD')} ) \n`;    
            });
            callback(text);
        })
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

   getHelp: function(req, res) {
        var text = `Welcome to the Bot Birthday Reminder \n\n`;
        
        return text;
   }

}

