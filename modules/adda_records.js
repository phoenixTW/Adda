var sqlite3 = require("sqlite3").verbose();
var _insertUsers = function(userData,db,onComplete){
	var insertUsersQuery = 'insert into registration (name, email_id, password) values("'+
		userData.name+'", "'+userData.email_id+'", "'+userData.password+'");';
	db.run(insertUsersQuery,onComplete);
};
var _getUserInfo = function(db,onComplete){
	var getUserInfoQry = "select * from registration";
	db.all(getUserInfoQry,onComplete);
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
		getUserInfo:operate(_getUserInfo)
	};
	return records;
};
exports.init = init;