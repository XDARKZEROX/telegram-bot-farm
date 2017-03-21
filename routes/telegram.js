var express = require('express');
var router = express.Router();
var telegramConstants = require("../config/config");
const Telegraf = require('telegraf');
const bot = new Telegraf(telegramConstants.telegramToken);


router.get('/', function(req, res, next) {

    //Creamos instanciamos el tg
    bot.telegram.getMe().then((botInfo) => {
        res.send(botInfo);
    });
});




module.exports = router;


