const
    express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    moment = require('moment'),
    locale = require('moment/locale/es'),
    emoji = require('node-emoji'),
    config = require('../../config/database'),
    async = require('async'),
    userModel = require('../model/user'),
    agentModel = require('../model/agent')
    ;

moment.locale('es');

module.exports = {
    // Obtienes toda la lista de cumpleaños!
    getBirthdays: callback => {

        let message = `<b>Lista de cumplea\u00f1os ${emoji.get('cake')} : </b>\n\n`;
        agentModel.find(function(err, result) {
            if (err) {
                callback('Ocurrio un problema.');
            } else {
                if (result != null || result != undefined) {
                    for (var key in result) {
                        message += `- ${result[key].name} ( ${moment(result[key].date).format('MMMM DD')} ) \n`;
                    }
                    callback(message);
                } else {
                    callback('Parece que no tengo registros todavia. Puedes empezar agregando el tuyo con el comando /profile.');
                }
            }
        });
    },

    getBirthdayToday: callback => {
        let systemDate = moment().format('DD-MM');
        let message = `<b>Lista de cumplea\u00f1os ${emoji.get('cake')} : </b>\n\n`;

        userModel.getAll(response => {
            if (response != null || response != undefined) {
                for (var key in response) {            
                    if (systemDate === moment(response[key].date).format('DD-MM')) {
                        message += `- ${response[key].name} ( ${moment(response[key].date).format('MMMM DD')} ) \n`;
                    }
                }

                if(systemDate === moment(response[key].date).format('DD-MM'))
                    callback(message);
                else
                    callback('No hay cumpleaños para hoy. Puedes empezar agregando el tuyo con el comando /profile.');
            }
            else {
                callback('Parece que no tengo registros todavia. Puedes empezar agregando el tuyo con el comando /profile.');
            }
        });
    },

    getHelp: () => {
        let message = 
        `<b>Bienvenid@ al bot de agenda Cumplea\u00f1era </b> \n\n` +
        `A continuaci\u00f3n la lista de comandos de este bot: \n` +
        `- /birthdays - Lista los cumpleaños de todos los registrados. \n` +
        `- /today - Averigua quien o quienes cumplen el dia de hoy. \n \n` +
        `- /find - Muestra información de la persona por codename. \n \n` +
        //`- /profile - TODO. \n \n` +
        `Si estás interesado en colaborar con el desarrollo de este bot, puedes visitar el repositorio en <a href="https://github.com/XDARKZEROX/telegram-bot-farm/">Github</a>`;
        return message;
    },

    getBirthdayFromCodename: (codename, callback) => {
        let message = '';
        console.log('getBirthdayFromCodename', codename);
        userModel.getUserByCodename(codename, (response) => {
            if (response != undefined || response != null) {
                message = `${response.name} (@${response.codename.toUpperCase()}), Fecha de Nacimiento: ${response.date}`;
            } else {
                message = `No encontr\u00e9 a alguien con ese codename, prueba nuevamente.`
            }
            callback(message);
        });
    }
}

//String.prototype.toCapitalize = () => { return this.toString().replace(/\b\w/g, l => { return l.toUpperCase(); }) }