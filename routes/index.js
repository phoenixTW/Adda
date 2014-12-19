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

router.get('/addtopics', function(req, res) {
  res.render('addtopics');
});


router.post('/addtopics',function(req,res){
	var userInfo = req.body;
	userId = req.session.user_id;
	userInfo.userId = userId; 
	userInfo.start_time = new Date();
	console.log(req.body)
	var getTopicId = function(err,topics){
		console.log(topics);
		!err && res.redirect('topic/'+topics["max(id)"]);
	};

	var callback = function(error){
		error && res.render('addtopics', {error:error});
		!error && lib.getTopicId(req.body.name,getTopicId)	
	}
	lib.addTopic(userInfo,callback);
});

router.post('/searchTopics', function(req, res) {
	var data = req.body;
	var callback = function(error,topics){
		(topics.length==0 || error) && res.render('addtopics',{error1:"Topic not found.."});
		(!error && topics.length>0) && res.render('addtopics',{name:topics});
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
	lib.getTopics(req.session.user_id,function(err,topics){
		var topics = topics.reverse();
		err && req.render('dashboard',{error:err})
		!err && res.render('dashboard',{topics:topics});
	})
});

router.get('/login',function(req,res){
	res.render('login');
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

router.get('/addtopics',function(req,res){
	res.render('addtopics');
});

router.post('/addtopics',function(req,res){
	var userInfo = req.body;
	userInfo.userId = req.session.user_id; 
	userInfo.start_time = new Date();
	
	var getTopicId = function (err, topicId) {
		err && res.render('addtopics', {error:error});
		!err && res.redirect('/topic/' + topicId.id);
	};

	var callback = function(error){
		error && res.render('addtopics', {error:error});
		!error && lib.getTopicId(userInfo.name, getTopicId);	
	};
	
	lib.addTopic(userInfo,callback);
});

router.get('/topic/:id', function (req, res) {
	var id = req.params.id;
	
	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			posts.id = id;
			var callback = function (err, details) {
				var getUser = function(err, userName) {
					var data = {
						posts: posts,
						details: details,
						adminName: userName.name
					}
					res.render('topic', data);
				};

				lib.getUserName(details.userId, getUser);
			};
			lib.getTopicDetails(id, callback);
		}
	};

	lib.getComments(id, onComplete);
});

router.post('/postComment/:id', function (req, res) {
	var post = {
		comment: req.body.comment,
		userId: req.session.name,
		time: new Date(),
		topicId: req.params.id
	};

	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			res.redirect('/topic/'+req.params.id);
		}
	};

	var callback = function (err) {
		lib.getComments(post.topicId, onComplete);
	}
	lib.postComment(post, callback);
});

module.exports = router;
