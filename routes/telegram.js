var express = require('express'),
    router = express.Router(),
    emoji = require('node-emoji'),
    telegramConstants = require("../config/config");
const TeleBot = require('telebot');
const bot = new TeleBot(telegramConstants.botToken);
var birthdayController = require('../app/controller/birthdayController.js');
var profileController = require('../app/controller/profileController.js');


bot.use(require('../modules/ask.js'));

router.get('/', function(req, res, next) {
    console.log(bot.telegram);
    //Creamos instanciamos el tg
    bot.telegram.getMe().then((botInfo) => {
        res.send(botInfo);
    });
});

bot.on('/birthdays', msg => {
    birthdayController.getBirthdays(function(rs) {
        let reply = msg.message_id;
        let parse = 'html';
        return bot.sendMessage(msg.chat.id, rs,  { reply, parse });
    });
});

bot.on('/find', msg => {
     const id = msg.chat.id;    
     return bot.sendMessage(id, 'De quien deseas buscar su Informaci\u00f3n? (Ingresa su codename sin el @)', { ask: 'codename' });
});

bot.on('ask.codename', msg => {

  let codename = msg.text.trim();
  const id = msg.chat.id;
  let parse = 'html';

  birthdayController.getBirthdayFromCodename(codename, function(rs) {
        return bot.sendMessage(id, rs, { parse });
  });
});

bot.on('/help', msg => {

    var text = birthdayController.getHelp();
    let parse = 'html';
    bot.sendMessage(msg.from.id, text,  { parse });

    //Refactorizar esto    
    /* return bot.sendMessage(msg.from.id, 'Getting time...').then(re => {
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

bot.on(['/profile'], msg => {
  
    let markup = bot.inlineKeyboard([
        [bot.inlineButton('Perfil', { callback: 'this_is_data' })]
    ]);
    return bot.sendMessage(msg.chat.id, 'Escoge una de las opciones', { markup });
});

bot.on('/Cancelar', msg => {
  return bot.sendMessage(
    msg.chat.id, 'Operaci\u00f3n Cancelada', { markup: 'hide' }
  );
});

bot.on('/MiPerfil', msg => {
  let message = '';
  profileController.searchProfile(msg.from.username, function(rs) {
    if(rs.status){
        return bot.sendMessage(
            msg.chat.id, 'Parece que ya te tengo registrado. Deseas editar tu informaci\u00f3n?'
        );
    } else {
        return bot.sendMessage(
            msg.chat.id, 'Parece que no tengo datos tuyos todavia.'
        );
    }
    });
});

bot.connect();
module.exports = router;