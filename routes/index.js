var express = require('express');
var lib = require('../modules/adda_records').init("data/adda.db");
var add = require('../modules/addTopics');
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

router.get('/addtopics',requireLogin, function(req, res) {
  res.render('addtopics');
});

router.get('/registration',function(req,res){
	res.render('registration');
});

router.get('/login',function(req,res){
	res.render('login');
});

router.get('/logout',function(req,res){
	req.session.destroy();
	res.redirect('/login');
});

router.get('/addtopics', requireLogin, function(req,res){
	res.render('addtopics');
});

router.post('/leave', function (req, res) {
	var requestData = req.body;
	var callback = function (error) {
		!error && res.redirect('/topic/' + requestData.topicId)
	};
	lib.deleteAction(requestData, callback);
});

router.get('/dashboard',requireLogin, function(req,res){
	lib.getTopics(req.session.user_id,function(err,topics){
		var topics = topics.reverse();
		err && req.render('dashboard',{error:err})
		!err && res.render('dashboard',{topics:topics});
	})
});

router.post('/addtopics', add.addTopics);

router.post('/startNewTopic', function(req, res) {
	var data = req.body;
	var callback = function(error,topics){
		(topics.length==0 || error) && res.render('addtopics',{error1:"Topic not found.."});
		(!error && topics.length>0) && res.render('addtopics',{name:topics});
	};
	if(data.searchText == ''){
		lib.getAllTopics(callback);
	}
	else
		lib.startNewTopic(data.searchText,callback);
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


router.get('/topic/:id',requireLogin, function (req, res) {
	var id = req.params.id;
	
	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			posts.id = id;
			getUserName(req, res, posts);
		}
	};

	lib.getComments(id, onComplete);
});

var getUserName = function (req, res, posts) {
	var callback = function (err, details) {
		var getUser = function(err, userName) {
			getUserActionSummery(req, res, posts, details, userName);
		};

		lib.getUserName(details.userId, getUser);
	};
	lib.getTopicDetails(posts.id, callback);

};

var getUserActionSummery = function (req, res, posts, details, userName) {
	var getActionDetails = function (actErr, actionDes) {
		actionDes = actionDes || {
			userId: req.session.user_id,
			topicId: posts.id,
			action: null
		};
		var data = {
			posts: posts,
			details: details,
			adminName: userName.name,
			action: actionDes
		};
		res.render('topic', data);
	};

	var ids = {
		topicId: posts.id,
		userId: req.session.user_id
	};

	lib.getAction(ids, getActionDetails);
};

router.post('/postComment/:id', requireLogin, function (req, res) {
	var post = {
		comment: req.body.msg,
		userId: req.session.name,
		time: new Date(),
		topicId: req.params.id
	};

	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			recentPost = posts.reverse()[0];
			res.render('showComments', {post: recentPost});
		}
	};

	var callback = function (err) {
		err && res.render('showComments', {error: 'Error: Don`t use double quote'});		
		!err && lib.getComments(post.topicId, onComplete);
	}
	lib.postComment(post, callback);
});

router.post('/join', function (req, res) {
	var requestData = req.body;
	requestData.action = 2;

	var callback = function (error) {
		console.log(error);
		!error && res.redirect('/topic/' + requestData.topicId)
	};

	lib.insertAction(requestData, callback);
});

router.post('/close', function (req, res) {
	var requestData = req.body;
	requestData.action = 0;

	var updateTopicData = {
		id: requestData.topicId,
		endTime: new Date()
	};

	var onComplete = function (error) {
		lib.updateAction(requestData, callback);
	};

	var callback = function (error) {
		!error && res.redirect('/topic/' + requestData.topicId)
	};

	lib.updateTopics(updateTopicData, onComplete);

});

module.exports = router;
