const TeleBot = require('telebot');
const telegramConstants = require('./database');
const bot = new TeleBot(telegramConstants.botToken);

bot.start();

module.exports = bot;
