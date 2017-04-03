var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    moment = require('moment');

module.exports = {
    getBirthdays : function(req, res){
        var birthdays = JSON.parse(fs.readFileSync('public/resources/birthdays.json', 'utf8'));
        res.send(birthdays);
    },

    getBirthdayToday: function(req, res) {
        var birthdays = JSON.parse(fs.readFileSync('public/resources/birthdays.json', 'utf8'));
        var systemDate  =  moment().format('DD-MM');
        var birthdaysToday = [];
        birthdays['birthdays'].forEach(function(item, index) {
            if(systemDate===moment(item.date).format('DD-MM')){
                birthdaysToday.push(item);
            }
        });
        res.send(response);
   }

}