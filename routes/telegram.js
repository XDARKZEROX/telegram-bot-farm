var express = require('express');
var router = express.Router();
var telegramConstants = require("../config/config");
const Telegraf = require('telegraf');
const bot = new Telegraf(telegramConstants.telegramToken);


router.get('/', function(req, res, next) {

    console.log(bot.telegram);
    //Creamos instanciamos el tg
    bot.telegram.getMe().then((botInfo) => {
        res.send(botInfo);
    });
});

bot.command('naztikmessage', (ctx) => {
    ctx.reply('Estoy vivo!')
})


module.exports = router;


