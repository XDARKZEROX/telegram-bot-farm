var express = require('express'),
    router = express.Router(),
    emoji = require('node-emoji'),
    telegramConstants = require("../config/config");
const TeleBot = require('telebot');
const bot = new TeleBot({
    token: telegramConstants.botToken,
    polling: { // Optional. Use polling.
        interval: 60, // Optional. How often check updates (in ms).
        timeout: 0, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 1000, // Optional. Reconnecting timeout (in ms).
        allowedUpdates: [] // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates regardless of type.
    }
});
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
        [bot.inlineButton('Mi Perfil', { callback: 'perfil' }),
         bot.inlineButton('Cancelar', { callback: 'cancelar' })]
    ]);
    return bot.sendMessage(msg.from.id, 'Escoge una de las opciones', { markup });
});

bot.on('/Cancelar', msg => {
  return bot.sendMessage(
    msg.chat.id, 'Operaci\u00f3n Cancelada', { markup: 'hide' }
  );
});

bot.on('callbackQuery', msg => {

    let message = '';
    if(msg.data == 'perfil'){
        profileController.searchProfile(msg.from.username, function(rs) {
            let markup;
            if(rs.status){
                markup = bot.inlineKeyboard([[bot.inlineButton('Editar', { callback: 'editar' })]]);
                message = 'Parece que ya te tengo registrado. Deseas editar tu informaci\u00f3n?';
            } else {
                markup = bot.inlineKeyboard([[bot.inlineButton('Agregar Informaci\u00f3n', { callback: 'agregar'})]]);
                message = 'Parece que no tengo datos tuyos todavia.';
            }
            console.log(msg);
            return bot.sendMessage(msg.from.id, message , { markup });
        });
    }
    if(msg.data == 'editar'){
        let markup = bot.inlineKeyboard([
            [
                bot.inlineButton('Fecha de Nacimiento', { callback: 'fecha' }),
                bot.inlineButton('Nombre', { callback: 'nombre' })
            ]
        ]);
        return bot.sendMessage(msg.from.id, 'Escoge que campo deseas actualizar' , { markup });
    }
    if(msg.data == 'nombre'){
        return bot.sendMessage(msg.from.id, 'Ingresa el nuevo nombre', { ask: 'nombre' });
    }
    if(msg.data == 'fecha'){
        return bot.sendMessage(msg.from.id, 'Ingres la fecha de tu nacimiento', { ask: 'fecha' });
    }
});

bot.on('ask.nombre', msg => {
    let newName = msg.text.trim();
    const id = msg.from.id;

    profileController.updateName(msg.from.username, newName, function(rs) {
        console.log(rs);
    });
});

bot.on('ask.fecha', msg => {

});

bot.connect();
module.exports = router;