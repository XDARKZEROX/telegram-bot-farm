const 
  express = require('express'),
  birthdayCtrl = require('../app/controller/birthdayController.js'),
  router = express.Router()
;

const bot = require('../config/bot');

bot.on('/birthdays', msg => {
    bot.sendMessage(msg.chat.id, 'Espere un momento ...');
    bot.sendChatAction(msg.chat.id, 'typing').then(() => {
        birthdayCtrl.getBirthdays((rs) => {
            let reply = msg.message_id;
            let parse = 'html';
            return bot.sendMessage(msg.chat.id, rs, { reply, parse });
        });
    })
});

bot.on('/today', msg => {
    bot.sendMessage(msg.chat.id, 'Espere un momento ...');

    bot.sendChatAction(msg.chat.id, 'typing').then(() => {
        birthdayCtrl.getBirthdayToday((rs) => {
            let reply = msg.message_id;
            let parse = 'html';
            return bot.sendMessage(msg.chat.id, rs, { reply, parse });
        });
    });
});

bot.on('/help', msg => {
    var text = birthdayCtrl.getHelp();
    let parse = 'html';
    bot.sendMessage(msg.from.id, text, { parse });
});

module.exports = router;
