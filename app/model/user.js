'use strict'

var  firebase = require('firebase'),
	 config = require('../../config/config'),
	 Client = require('node-rest-client').Client,
	 async = require('async');
var client = new Client();
firebase.initializeApp(config.firebase);
var ref = firebase.database().ref().child("users"); 
		
module.exports = {

	getAll : function(callback) { 
		let users;
		async.series([
			function(callback) {
        		client.get(config.firebase_rest, function (data, response) {
    				users = data;
    				callback();
    			});        
            }
        ], function (err, result) {
        	callback(users);
   		});
	},

	getUserByCodename: function(param, callback) {

		ref.orderByChild('codename').equalTo(param.toLowerCase()).once('value').then(function (snapshot) {
			let rs;
			snapshot.forEach(function(childSnapshot) {
				rs = childSnapshot.val();
			});
        	callback(rs);
        }).catch((error) => {
    		console.log(error);
    	});
	},

	updateNameFromCodename: function(codename, name) {
		ref.orderByChild('codename').equalTo(codename.toLowerCase()).once('child_added').then(function (snapshot) {
			snapshot.ref.update({ name: name })
		}).catch((error) => {
			console.log(error);
		});
	},

	updateDateFromCodename: function(codename, date) {
		ref.orderByChild('codename').equalTo(codename.toLowerCase()).once('child_added').then(function (snapshot) {
			snapshot.ref.update({ date: date })
		}).catch((error) => {
			console.log(error);
		});
	},

	save: function(user, callback){
		var newChildRef = ref.push();
		newChildRef.set({
			name: user.get("name"),
			codename: user.get("codename").toLowerCase(),
			date: user.get("date")
		}, function(error) {
			if(error){
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

