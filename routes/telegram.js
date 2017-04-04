var express = require('express'),
    router = express.Router(),
    telegramConstants = require("../config/config");
const TeleBot = require('telebot');
const bot = new TeleBot(telegramConstants.botToken);
var birthdayController = require('../app/controller/birthdayController.js');

router.get('/', function(req, res, next) {
    console.log(bot.telegram);
    //Creamos instanciamos el tg
    bot.telegram.getMe().then((botInfo) => {
        res.send(botInfo);
    });
});

/*
bot.on('text', msg => {
    let fromId = msg.from.id;
    //console.log(fromId);
    let firstName = msg.from.first_name;
    let reply = msg.message_id;
    console.log(reply);
    bot.getChat('-1001079582906').then((botInfo) => {
        //console.log(botInfo);
    });

    return bot.sendMessage(fromId, `Hola ${ firstName } , deja de spamearme carajo!`);
    //return bot.sendMessage(fromId, 'Hola ' + firstName, { reply });
});*/

bot.on('/today', msg => {
    var birthdays = birthdayController.getBirthdays();
    let reply = msg.message_id;
    console.log(msg);
    let parse = 'html';
    return bot.sendMessage(msg.chat.id, birthdays,  { reply, parse });
});

bot.on('/birthdays', msg => {

});


bot.connect();
module.exports = router;
