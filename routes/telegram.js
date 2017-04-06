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
bot.on('sticker', msg => {
    let fromId = msg.from.id;
    //console.log(fromId);
    let firstName = msg.from.first_name;
    let reply = msg.message_id;
    console.log(msg);
    bot.getChat('-1001079582906').then((botInfo) => {
        //console.log(botInfo);
    });

    return bot.sendMessage(fromId, `Hola ${ firstName } , deja de spamearme carajo!`);
    //return bot.sendMessage(fromId, 'Hola ' + firstName, { reply });
});*/

bot.on('/birthdays', msg => {

    birthdayController.getBirthdays(function(rs) {
        let reply = msg.message_id;
        let parse = 'html';
        return bot.sendMessage(msg.chat.id, rs,  { reply, parse });
    });

});

bot.on('/today', msg => {


});

bot.on('/help', msg => {

    var text = birthdayController.getHelp();
    let parse = 'html';
    bot.sendMessage(msg.from.id, text,  { parse });
    
/*    return bot.sendMessage(msg.from.id, 'Getting time...').then(re => {
    // Start updating message
        var chatId = msg.from.id;
        var msgId = re.result.message_id;
        console.log(msgId);
        console.log(re);
        //editText({chatId & messageId | inlineMsgId}, <text>)
        bot.editText(
            { chatId , msgId }, `Cual editado prro`,
            { parse: 'html' }
        ).catch(error => console.log('Error:', error));   
   
    });*/
});

bot.connect();
module.exports = router;