var express = require('express'),
    router = express.Router(),
    moment = require('moment');
var bot = require('../config/database/firebase');
var birthdayController = require('../app/controller/birthdayController.js');
var profileController = require('../app/controller/profileController.js');
const nodeCache = require( "node-cache" );
const agentCache = new nodeCache();
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

bot.on('/help', msg => {
    var text = birthdayController.getHelp();
    let parse = 'html';
    bot.sendMessage(msg.from.id, text,  { parse });
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
            return bot.sendMessage(msg.from.id, message , { markup });
        });
    }
    if(msg.data == 'editar'){
        let markup = bot.inlineKeyboard([
            [
                bot.inlineButton('Fecha de Nacimiento', { callback: 'fecha' }),
                bot.inlineButton('Nombre', { callback: 'editName' }),
                bot.inlineButton('CodeName', { callback: 'editCodename' })
            ]
        ]);
        return bot.sendMessage(msg.from.id, 'Escoge que campo deseas actualizar' , { markup });
    }
    if(msg.data == 'nombre'){
        return bot.sendMessage(msg.from.id, 'Ingresa el nuevo nombre', { ask: 'nombre' });
    }
    if(msg.data == 'fecha'){
        return bot.sendMessage(msg.from.id, 'Ingresa la fecha de tu nacimiento (YYYY-MM-DD)', { ask: 'fecha' });
    }
    if(msg.data == 'agregar'){
        profileController.searchProfile(msg.from.username, function(rs) {
            console.log(rs);
            if(rs.status){
                return bot.sendMessage(msg.from.id, 'Ya est\u00E1s registrado en la base de datos.');
            } else {
                return bot.sendMessage(msg.from.id, 'Perfecto. Para empezar ingresa tu nombre', { ask: 'addNombre' });
            }
        });
    }
});

bot.on('ask.codename', msg => {
    let codename = msg.text.trim();
    const id = msg.chat.id;
    let parse = 'html';

    birthdayController.getBirthdayFromCodename(codename, function(rs) {
        return bot.sendMessage(id, rs, { parse });
    });
});

bot.on('ask.nombre', msg => {
    let newName = msg.text.trim();
    const id = msg.from.id;

    profileController.updateName(msg.from.username, newName, function(rs) {
        console.log('me falta');
    });
});

bot.on('ask.fecha', msg => {
    //Validamos la fecha
    if(moment(msg.text.trim(), ["YYYY-MM-DD"], true).isValid()){
        console.log('valido');
    } else {
        return bot.sendMessage(msg.from.id, 'El formato de fecha (YYYY-MM-DD) no es v\u00E1lido, prueba nuevamente', { ask: 'fecha' });
    }
});

bot.on('ask.addNombre', msg => {
    //si es necesario validar
    agentCache.set("name", msg.text);

    return bot.sendMessage(msg.from.id, `Bienvenido ${msg.text}. Ahora por favor ingresa tu Codename (Sin el @)`, { ask: 'addCodename' });
});

bot.on('ask.addCodename', msg => {
    //si es necesario validar
    agentCache.set("codename", msg.text);
    return bot.sendMessage(msg.from.id, `Para finalizar. Ingresa tu fecha de nacimiento (YYYY-MM-DD)`, { ask: 'addFecNac' });
});

bot.on('ask.addFecNac', msg => {
    //si es necesario validar
    if(moment(msg.text.trim(), ["YYYY-MM-DD"], true).isValid()){
        agentCache.set("date", msg.text);
        //Agregamos al firebase
        profileController.saveAgent(agentCache, function(rs){
            if(rs.status){
                return bot.sendMessage(msg.from.id, 'Listo! Tu perfil ha sido registrado. Puedes usar el comando "birthdays" para ver tu info');
            } else {
                return bot.sendMessage(msg.from.id, 'Parece que ocurri\u00F3 de un error. Prueba nuevamete');
            }
        });
    } else {
        return bot.sendMessage(msg.from.id, 'El formato de fecha (YYYY-MM-DD) no es v\u00E1lido, prueba nuevamente', { ask: 'addFecNac' });
    }
});

module.exports = router;

