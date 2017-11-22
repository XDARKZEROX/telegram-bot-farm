'use strict';

const
	firebase = require('firebase'),
	config = require('../../config/database'),
	Client = require('node-rest-client').Client,
	async = require('async');

const client = new Client();

firebase.initializeApp(config.firebase);
const ref = firebase.database().ref().child("users");

module.exports = {

	getAll: (callback) => {
		let users;
		async.series([
			(callback) => {
				client.get(config.firebase.databaseURL + '/users.json', (data, response) => {
					users = data;
					callback();
				});
			}
		],(err, result) => {
			callback(users);
		});
	},

	getUserByCodename: (param, callback) => {
		ref.orderByChild('codename').equalTo(param.toLowerCase()).once('value').then(snapshot => {
			let rs;
			snapshot.forEach(childSnapshot => {
				rs = childSnapshot.val();
			});
			callback(rs);
		}).catch((error) => {
			console.log(error);
		});
	},

	updateNameFromCodename: (codename, name) => {
		ref.orderByChild('codename').equalTo(codename.toLowerCase()).once('child_added').then(snapshot => {
			snapshot.ref.update({ name: name })
		}).catch(error => {
			console.log(error);
		});
	},

	updateDateFromCodename: (codename, date) => {
		ref.orderByChild('codename').equalTo(codename.toLowerCase()).once('child_added').then(snapshot => {
			snapshot.ref.update({ date: date })
		}).catch(error => {
			console.log(error);
		});
	},

	save: (user, callback) => {
		var newChildRef = ref.push();
		newChildRef.set({
			name: user.get("name"),
			codename: user.get("codename").toLowerCase(),
			date: user.get("date")
		}, error => {
			if (error) {
				callback({
					status: false,
				});
			} else {
				callback({
					status: true
				});
			}
		});
	}

}

