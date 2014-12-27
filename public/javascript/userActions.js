var joinTopic = function (userId, topicId, action, method) {
	var actionDes = {
		userId: userId,
		topicId: topicId,
		action: action
	};

	$.post('/' + method, {userId: userId, topicId: topicId, action: action}).done(function(){
		window.location.replace('/topic/' + actionDes.topicId);
	});
};

