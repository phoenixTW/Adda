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
	console.log(data,"userData",userData);
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
	select(db, onComplete, 'registration', 'get', ['password', 'id'], whereToGet);
};


exports.queryParser = {
	selectQueryMaker: selectQueryMaker,
	insertQueryMaker: insertQueryMaker
};


exports.queryHandler = {
	select: select,
	insertInto: insertInto
};

var _getSingleUser = function(email_id,db,onComplete){
	var whereToGet = {email_id: email_id};
	select(db, onComplete, 'registration', 'get', null, whereToGet);
};
var _searchTopics = function(startChars,db,onComplete){console.log(startChars,db);
	var searchTopicsQry = "select name from topics where name like '%"+startChars+"%'";
	try{
		db.all(searchTopicsQry,onComplete);
	}
	catch(err){
		throw new err;
	}
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
}

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
		getComments: operate(_getComments)
	};
	return records;
};
exports.init = init;