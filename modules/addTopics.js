var lib = require('../modules/adda_records').init("data/adda.db");

exports.addTopics = function(req,res){
	var userInfo = req.body;
	userId = req.session.user_id;
	userInfo.userId = userId; 
	userInfo.start_time = new Date();
	

	var getTopicId = function(err,topics){
		var onComplete = function (actErr) {
			!actErr && res.redirect('topic/'+topics["max(id)"]);
		};

		var data = {
			topicId: topics["max(id)"],
			userId: userId,
			action: 1
		};

		!err && lib.insertAction(data, onComplete);;
	};

	var callback = function(error){
		error && res.render('addtopics', {error:error});
		!error && lib.getTopicId(req.body.name,getTopicId)	
	}
	lib.addTopic(userInfo,callback);
};