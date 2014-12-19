var sqlite3 = require("sqlite3").verbose();

var insertQueryMaker = function (tableName, data, fields) {
	var columns = fields && ' (' + fields.join(', ') + ')' || '';
	var values = '"' + data.join('", "') + '"';
	var query = 'insert into ' + tableName + columns + ' values(' + values + ');';
	return query;
};

var selectQueryMaker = function (tableName, retrivalData, where) {
	retrivalData = retrivalData || ['*'];
	var whatToGet = retrivalData.join(', ');
	var whereToGet = where && retrieveWhereToGet(where) || '';

	var query = 'select ' + whatToGet + ' from ' + tableName + whereToGet + ';';
	return query;
};

var insertInto = function (db, fields, data, tableName, onComplete) {
	var query = insertQueryMaker(tableName, data, fields);
	db.run(query, onComplete);
};


var select = function (db, onComplete, tableName, retriveMethod, retrivalData, where) {
	var query = selectQueryMaker(tableName, retrivalData, where);
	db[retriveMethod](query, onComplete);
};

var _addTopic = function(userData, db, onComplete){
	var fields = ['name', 'description', 'userId',"start_time"];
	var data = [userData.name, userData.description, userData.userId, userData.start_time];
	insertInto(db, fields, data, 'topics', onComplete);
};

var _getUserInfo = function(db,onComplete){
	select(db, onComplete, 'registration', 'all');
};


var _insertUsers = function (userData, db, onComplete) {
	var fields = ['name', 'email_id', 'password'];
	var data = [userData.name, userData.email_id, userData.password];

	insertInto(db, fields, data, 'registration', onComplete);
};

var retrieveWhereToGet = function (resource) {
	var whereToGet = Object.keys(resource).map(function (key) {
		return key + ' = "' + resource[key] + '"';
	}).join(' and ');

	return ' where ' + whereToGet;
};

var _getPassword = function (email_id, db, onComplete) {
	var whereToGet = {email_Id: email_id};
	select(db, onComplete, 'registration', 'get', ['password', 'id', 'name'], whereToGet);
};


var _getSingleUser = function(email_id,db,onComplete){
	var whereToGet = {email_id: email_id};
	select(db, onComplete, 'registration', 'get', null, whereToGet);
};
var _searchTopics = function(startChars,db,onComplete){console.log(startChars);
	var searchTopicsQry = "select id,name from topics where name like '%"+startChars+"%'";
	db.all(searchTopicsQry,onComplete);
}
var _getAllTopics = function(db,onComplete){
	searchTopicsQry = "select id,name from topics";
	db.all(searchTopicsQry,onComplete);

}
var _getComments = function (topicId, db, onComplete) {
	var whereToGet = {topic_id: topicId};
	select(db, onComplete, 'comments', 'all', null, whereToGet);
};

var _postComment = function (post, db, onComplete) {
	var fields = ['topic_id', 'comment', 'userId', 'time'];
	var whatToSend = [post.topicId, post.comment, post.userId, post.time];
	insertInto(db, fields, whatToSend, 'comments', onComplete);
};

var _getTopicInfo = function(db,onComplete){
	select(db, onComplete, 'topics', 'all');
};

var _getTopicId = function (topicName, db, onComplete) {
	var whereToGet = {name: topicName};
	select(db, onComplete, 'topics', 'get', ['id'], whereToGet);
};

var _getTopicDetails = function (topicId, db, onComplete) {
	var whereToGet = {id: topicId};
	select(db, onComplete, 'topics', 'get', null, whereToGet);
};

var _getUserName = function (usrId, db, onComplete) {
	var whereToGet = {id: usrId};
	select(db, onComplete, 'registration', 'get', ['name'], whereToGet);
};

var _getTopics = function(userId,db,onComplete){
	select(db,onComplete,"topics",'all',["name"],{userId:userId});
};

var init = function(location){	
	var operate = function(operation){
		return function(){
			var onComplete = (arguments.length == 2)?arguments[1]:arguments[0];
			var arg = (arguments.length == 2) && arguments[0];

			var onDBOpen = function(err){
				if(err){onComplete(err);return;}
				db.run("PRAGMA foreign_keys = 'ON';");
				arg && operation(arg,db,onComplete);
				arg || operation(db,onComplete);
				db.close();
			};
			var db = new sqlite3.Database(location,onDBOpen);
		};	
	};

	var records = {		
		insertUsers:operate(_insertUsers),
		getUserInfo:operate(_getUserInfo),
		getPassword:operate(_getPassword),
		getSingleUser:operate(_getSingleUser),
		addTopic:operate(_addTopic),
		getTopicInfo:operate(_getTopicInfo),
		searchTopics:operate(_searchTopics),
		postComment: operate(_postComment),
		getComments: operate(_getComments),
		getTopicId: operate(_getTopicId),
		getTopicDetails: operate(_getTopicDetails),
		getUserName: operate(_getUserName),
		getTopics:operate(_getTopics),
		getAllTopics:operate(_getAllTopics)
	};
	return records;
};

exports.init = init;

exports.queryParser = {
	selectQueryMaker: selectQueryMaker,
	insertQueryMaker: insertQueryMaker
};


exports.queryHandler = {
	select: select,
	insertInto: insertInto
};
