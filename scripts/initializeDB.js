var location = process.argv[2];
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database(location);

var runAllQuery = function () {
	var runQuery = function (query) {
		console.log(query);
		db.run(query, function (error) {
			if(error) {
				console.log(error);
				process.exit(1);
			}
		});
	};

	[
		"create table if not exists registration(id integer primary key autoincrement,name text not null, email_id text unique not null, password text not null);",
		"create table if not exists topics(id integer primary key autoincrement,name text not null, description text , userId integer not null, start_time text not null, end_time text ,foreign key(userId) references registration(id));",
		"create table if not exists comments(topic_id integer, comment text, userId integer not null, time text not null);",
		"create table if not exists users(userId integer not null, action integer, topicId integer,foreign key(userId) references registration(id));",
		"create table if not exists joinedTopics(userId integer not null,topic_id integer not null, join_date text default (datetime('now','localtime')),leave_date text, foreign key(userId) references registration(id), foreign key(topic_id) references topics(id));",
	].forEach(runQuery);
};

db.serialize(runAllQuery);