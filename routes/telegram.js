const
    express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    birthdayCtrl = require('../app/controller/birthdayController.js'),
    profileCtrl = require('../app/controller/profileController.js'),
    nodeCache = require('node-cache'),
    agentCache = new nodeCache()
    ;

const bot = require('../config/bot');
bot.use(require('../modules/ask.js'));

router.get('/', (req, res, next) => {
    console.log(bot.telegram);
    //Creamos instanciamos el tg
    bot.telegram
        .getMe()
        .then((botInfo) => {
            res.send(botInfo);
        });
});

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

bot.on('/find', msg => {
    let id = msg.chat.id;
    //return bot.sendMessage(id, '¿De quien deseas buscar su informaci\u00f3n?. Ingresa su codename (sin el @)', { ask: 'codename' });
    // TODO no encuentro manera de mantener una sesion abierta con el usuario. Como fallback ...
    bot.sendMessage(msg.chat.id, 'Espere un momento ...');
    let codename = msg.text.substring(msg.entities[0].length).trim(); 
    let parse = 'html';

    if(codename.length == 0) return bot.sendMessage(id, 'Debes ingresar el codename seguido del comando /find');

    bot.sendChatAction(msg.chat.id, 'typing').then(() => {
        birthdayCtrl.getBirthdayFromCodename(codename, (rs) => {
            return bot.sendMessage(id, rs, { parse });
        });
    });
});

bot.on('/help', msg => {
    var text = birthdayCtrl.getHelp();
    let parse = 'html';
    bot.sendMessage(msg.from.id, text, { parse });
});

bot.on(['/profile'], msg => {
    let markup = bot.inlineKeyboard([
        [
            bot.inlineButton('Mi Perfil', { callback: 'perfil' }),
            bot.inlineButton('Cancelar', { callback: 'cancelar' })
        ]
    ]);
    return bot.sendMessage(msg.from.id, 'Escoge una opcion', { markup });
});

bot.on('/Cancelar', msg => {
    return bot.sendMessage(
        msg.chat.id, 'Operaci\u00f3n Cancelada', { markup: 'hide' }
    );
});

bot.on('callbackQuery', msg => {
    let message = '';
    if (msg.data == 'perfil') {
        profileCtrl.searchProfile(msg.from.username, (rs) => {
            let markup;
            if (rs.status) {
                markup = bot.inlineKeyboard([[bot.inlineButton('Editar', { callback: 'editar' })]]);
                message = 'Parece que ya te tengo registrado. ¿Deseas editar tu informaci\u00f3n?';
            } else {
                markup = bot.inlineKeyboard([[bot.inlineButton('Agregar Informaci\u00f3n', { callback: 'agregar' })]]);
                message = 'Parece que no tengo datos tuyos todavia.';
            }
            return bot.sendMessage(msg.from.id, message, { markup });
        });
    }
    if (msg.data == 'editar') {
        let markup = bot.inlineKeyboard([
            [
                bot.inlineButton('Fecha de Nacimiento', { callback: 'fecha' }),
                bot.inlineButton('Nombre', { callback: 'editName' }),
                bot.inlineButton('CodeName', { callback: 'editCodename' })
            ]
        ]);
        return bot.sendMessage(msg.from.id, 'Escoge que campo deseas actualizar', { markup });
    }
    if (msg.data == 'editName') {
        return bot.sendMessage(msg.from.id, 'Ingresa el nuevo nombre', { ask: 'nombre' });
    }
    if (msg.data == 'fecha') {
        return bot.sendMessage(msg.from.id, 'Ingresa la fecha de tu nacimiento (YYYY-MM-DD)', { ask: 'fecha' });
    }
    if (msg.data == 'agregar') {
        profileCtrl.searchProfile(msg.from.username, (rs) => {
            console.log(rs);
            if (rs.status) {
                return bot.sendMessage(msg.from.id, 'Ya est\u00E1s registrado.');
            } else {
                return bot.sendMessage(msg.from.id, 'Perfecto. Para empezar ingresa tu nombre', { ask: 'addNombre' });
            }
        });
    }
});

// TODO nunca llego aqui
bot.on('ask.codename', msg => {
    let codename = msg.text.trim();
    const id = msg.chat.id;
    let parse = 'html';

    return bot.sendMessage(msg.chat.id, msg.text);
    birthdayCtrl.getBirthdayFromCodename(codename, (rs) => {
        return bot.sendMessage(id, rs, { parse });
    });
});

bot.on('ask.nombre', msg => {
    let newName = msg.text.trim();
    const id = msg.from.id;

    profileCtrl.updateName(msg.from.username, newName, (rs) => {
        console.log('me falta');
    });
});

bot.on('ask.fecha', msg => {
    //Validamos la fecha
    let newDate = msg.text.trim();

    if (moment(msg.text.trim(), ["YYYY-MM-DD"], true).isValid()) {
        profileCtrl.updateDate(msg.from.username, newDate, (rs) => {
            console.log('me falta');
        });
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
    if (moment(msg.text.trim(), ["YYYY-MM-DD"], true).isValid()) {
        agentCache.set("date", msg.text);
        //Agregamos al firebase
        profileCtrl.saveAgent(agentCache, (rs) => {
            if (rs.status) {
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

