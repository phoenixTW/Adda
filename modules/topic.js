var lib = require('../modules/adda_records').init("data/adda.db");

exports.getTopicPage = function (req, res) {
	var id = req.params.id;
	
	var onComplete = function (error, posts) {
		error && next();
		if(posts) {
			posts.id = id;
			getUserName(req, res, posts);
		}
	};

	lib.getComments(id, onComplete);
};

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

exports.postComment = function (req, res) {
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
};

exports.joinTopic = function (req, res) {
	var requestData = req.body;
	requestData.action = 2;

	var callback = function (error) {
		console.log(error);
		!error && res.redirect('/topic/' + requestData.topicId)
	};

	lib.insertAction(requestData, callback);
};

exports.leaveTopic = function (req, res) {
	var requestData = req.body;
	var callback = function (error) {
		!error && res.redirect('/topic/' + requestData.topicId)
	};
	lib.deleteAction(requestData, callback);
};

exports.closeTopic = function (req, res) {
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

};