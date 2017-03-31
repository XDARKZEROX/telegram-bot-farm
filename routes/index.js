var express = require('express');
var router = express.Router();
var searchController = require("../app/controller/birthdayController");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/birthdays', function(req, res, next) {
  searchController.getBirthdays(req, res);
});

router.get('/today', function(req, res, next) {
  searchController.getBirthdayToday(req, res);
});


module.exports = router;
