var express = require('express');
var lib = require('../modules/adda_records').init("data/adda.db");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/registration',function(req,res){
	res.render('registration');
});

router.get('/dashboard',function(req,res){
	res.render('dashboard');
});

router.get('/login',function(req,res){
	res.render('login');
});

router.post('/registration',function(req,res){
	var userInfo = req.body;
	var callback = function(error){
		error && res.render('registration', {error:"User already present.."});
		!error && res.redirect('dashboard');
	};
	lib.insertUsers(userInfo,callback);
});

module.exports = router;
