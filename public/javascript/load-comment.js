$(document).ready(function(){
	var comments = $("#comment").html();
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
})
