const 
express = require('express'),
router = express.Router(),
searchCtrl = require("../app/controller/birthdayController")
;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/birthdays', (req, res, next) => {
  searchCtrl.getBirthdays(req, res);
});

router.get('/today', (req, res, next) => {
  searchCtrl.getBirthdayToday(req, res);
});

module.exports = router;
