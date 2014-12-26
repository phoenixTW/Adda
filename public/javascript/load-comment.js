$(document).ready(function(){
	comments = $("#comment").html();
	// $('#post').click(onPost);
	var lastFive = comments.split('<div> ').join('').split('</div>').slice(0,5);
	var lastFiveHml = lastFive.map(function(value) {
		return '<div>' + value + '</div>';
	}).join('');

	$('#comment').html(lastFiveHml);

	$("#load").click(function(){
		var allComments = comments.split('<div> ').join('').split('</div>');
		$("#load").val('Everything is Loaded');
		$("#comment").html(allComments);
	});
});

var comment;
var onPost = function (id) {
	comment = $("#comment").html();
	var msg = $("#msg").val();
	$('#msg').val('');	
	$.post('/postComment/' + id, {msg: msg}).done(onPostDone).error(function(err){
		$('#comment').html(err.responseText);		
	});
};

var onPostDone = function(fileNamesHTML){
	var commentHtml = comment + fileNamesHTML;
	$('#comment').html(commentHtml);
};
