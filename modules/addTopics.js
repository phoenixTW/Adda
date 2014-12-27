var lib = require('../modules/adda_records').init("data/adda.db");

exports.addTopics = function(req,res){
	var userInfo = req.body;
	userInfo.userId = req.session.user_id;
	userInfo.start_time = new Date();
	
	var getTopicId = function(err,topics){
		var onComplete = function (actErr) {
			!actErr && res.redirect('topic/'+topics["max(id)"]);
		};

		var data = {
			topicId: topics["max(id)"],
			userId: userInfo.userId,
			action: 1
		};

		!err && lib.insertAction(data, onComplete);;
	};

	var callback = function(error){
		error && res.render('addtopics', {error:error});
		!error && lib.getTopicId(req.body.name,getTopicId)	
	};
	
	lib.addTopic(userInfo,callback);
};

exports.searchTopic = function(req, res) {
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
};