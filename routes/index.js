var express = require('express');
var lib = require('../modules/adda_records').init("data/adda.db");
var router = express.Router();
var bcrypt = require("bcryptjs");
// var salt = bcrypt.genSaltSync(10);

/* GET home page. */

var loadUserFromSession = function(req,res,next){
	req.session.userEmail && lib.getSingleUser(req.session.userEmail, function(err, user){
		if(user){
			var userInfo = {
				id: user.id,
				name: user.name,
				email_id: user.email_id
			};

			req.user = userInfo;
			res.locals.user = userInfo;
		}else{
			delete req.session.userEmail;
		}
	});
	next();		
};

var requireLogin = function(req,res,next){
	req.session.userEmail? next(): res.redirect('/login');
};

router.use(loadUserFromSession);

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/addaTopic', function(req, res) {
  res.render('addaTopic');
});

router.post('/addaTopic', function(req, res) {
	var data = req.body;
	var callback = function(error,topics){
		console.log(topics);
		(error || topics == []) && res.render('addaTopic',{error:"Topic not found.."});
		(!error && topics.length>0) && res.render('addaTopic',{name:topics});
	};
	if(data.searchText == ''){
		lib.getAllTopics(callback);
	}
	else
		lib.searchTopics(data.searchText,callback);
});


router.get('/registration',function(req,res){
	res.render('registration');
});

router.get('/dashboard',requireLogin, function(req,res){
	res.render('dashboard');
});

router.get('/login',function(req,res){
	res.render('login');
});

router.post('/login',function(req,res){
	var userInfo = req.body;
	var callback = function(error,password){
		if(((password===undefined) || error || 
			(!bcrypt.compareSync(userInfo.password,password.password)))){
		 	res.render('login', {error:"Invalid Username or Password.."});
		}
		if(!error && (password!==undefined) && 
			bcrypt.compareSync(userInfo.password,password.password)){
			req.session.userEmail = userInfo.email_id;
			req.session.userId = password.id;
  			res.redirect('/dashboard');
		}
	};

	lib.getPassword(userInfo.email_id,callback);
});

router.get('/logout',function(req,res){
	req.session.destroy();
	res.redirect('/login');
});

router.post('/registration',function(req,res){
	var userInfo = req.body;
	userInfo.password = bcrypt.hashSync(userInfo.password);
	var callback = function(error){
		error && res.render('registration', {error:"User already present.."});
		!error && res.redirect('dashboard');
	};
	lib.insertUsers(userInfo,callback);
});

router.get('/topic/:id', function (req, res) {
	res.render('topic', {id: req.params.id});
});

router.post('/postComment/:id', function (req, res) {
	var post = {
		comment: req.body.comment,
		userId: req.session.userId,
		time: new Date(),
		topicId: req.params.id
	};

	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			res.render('topic', {id: req.params.id, comments: posts});
		}
	};

	var callback = function (err) {
		lib.getComments(post.topicId, onComplete);
	}
	lib.postComment(post, callback);
});

module.exports = router;
