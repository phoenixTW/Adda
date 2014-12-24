var joinTopic = function (userId, topicId, action) {
	var actionDes = {
		userId: userId,
		topicId: topicId,
		action: action
	};

	$.post('/setAction', {actionDes: actionDes}).done(function(){
		window.location.replace('/topic/' + actionDes.topicId);
	});
};

