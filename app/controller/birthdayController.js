var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    moment = require('moment');
    emoji = require('node-emoji')

module.exports = {
    // Obtienes toda la lista de cumpleaños!
    getBirthdays : function(req, res){
        var birthdays = JSON.parse(fs.readFileSync('public/resources/birthdays.json', 'utf8'));
        var text=`<b>Lista de cumplea\u00f1os ${emoji.get('cake')} : </b>\n\n`;

        birthdays['birthdays'].forEach(function(item, index) {
            
            text += `- ${item.name} ( ${moment(item.date).format('MMMM DD')} ) \n`;
        });

        return text;
        //res.send(birthdays);
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
   }

}

