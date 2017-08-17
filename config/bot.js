const TeleBot = require('telebot');
const telegramConstants = require("../config/config");
const bot = new TeleBot(telegramConstants.botToken);

bot.connect();
module.exports = bot;