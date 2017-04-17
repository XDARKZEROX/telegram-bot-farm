'use strict'

var  firebase = require('firebase'),
	 config = config = require('../../config/config'),
	 Client = require('node-rest-client').Client,
	 async = require('async');

//firebase.initializeApp(config.firebase);
//var users = firebase.database().ref().child("users");
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

		/*
		users.on("value", (snap) = {
  			snap.forEach((child) => {
				users[child.val().codename]['date'] = child.val().date;
				users[child.val().codename]['name'] = child.val().name;
			});
		
		}, function (errorObject) {
  			console.log("Error de lectura: " + errorObject.code);
		});*/	
	},

	getUserByCodename: function(param, callback) {
		ref.orderByChild('codename').equalTo(param).once('value').then(function (snapshot) {
			callback(snapshot.val());
		});

	}

}	   

