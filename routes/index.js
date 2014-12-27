var express = require('express');
var lib = require('../modules/adda_records').init("data/adda.db");
var add = require('../modules/addTopics');
var topic = require('../modules/topic');
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
	lib.top5ActiveTopics(function(err,topics){
  		res.render('index',{topics:topics});
	})
});

router.get('/login',function(req,res){
	res.render('login');
});

router.get('/logout',function(req,res){
	req.session.destroy();
	res.redirect('/login');
});

router.get('/addtopics',requireLogin, function(req, res) {
  res.render('addtopics');
});

router.get('/registration',function(req,res){
	res.render('registration');
});

router.post('/login',function(req,res){
	var userInfo = req.body;
	var callback = function(error,data){
		if(((data===undefined) || error || 
			(!bcrypt.compareSync(userInfo.password,data.password)))){
		 	res.render('login', {error:"Invalid Username or Password.."});
		};
		if(!error && (data!==undefined) && 
			bcrypt.compareSync(userInfo.password,data.password)){
			req.session.userEmail = userInfo.email_id;
			req.session.user_id = data.id;
			req.session.name = data.name;
  			res.redirect('/dashboard');
		};
	};

	lib.getPassword(userInfo.email_id,callback);
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

router.get('/dashboard',requireLogin, function(req,res){
	lib.getTopics(req.session.user_id,function(err,topics){
		var topics = topics.reverse();
		err && req.render('dashboard',{error:err})
		!err && res.render('dashboard',{topics:topics});
	})
});

router.post('/addtopics', add.addTopics);

router.post('/searchTopics', add.searchTopic);

router.get('/topic/:id',requireLogin, topic.getTopicPage);

router.post('/postComment/:id', requireLogin, topic.postComment);

router.post('/join', topic.joinTopic);

router.post('/leave', topic.leaveTopic);

router.post('/close', topic.closeTopic);

module.exports = router;
