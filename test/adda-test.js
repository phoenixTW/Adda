var lib = require('../modules/adda_records');
var assert = require('chai').assert;
var fs = require('fs');
var dbFileData = fs.readFileSync('test/data/adda.db.backup');

var adda_records;
describe('adda_records',function(){
	beforeEach(function(){
		fs.writeFileSync('test/data/adda.db',dbFileData);
		adda_records = lib.init('test/data/adda.db');
	});
	
	describe('#insertUsers',function(){
		it('insert user info into registration table',function(done){
			var user = {
				name: 'sayli',
				email_id: 'sayli@yahoo.com',
				password: '1234'
			};

			var callback = function(error,userInfo){
				assert.notOk(error);
				user.id = 3;
				assert.deepEqual(userInfo[2], user);
				done();
			};
			adda_records.insertUsers(user, function(err){
				assert.notOk(err);
				adda_records.getUserInfo(callback);
			});
		});
	});

		describe('#getPassword',function(){
		it('should give 12345 for kaustav.ron@gmail.com',function(done){
			var email_id = "kaustav.ron@gmail.com";
			var expected_password = "12345";
			adda_records.getPassword(email_id, function(err,password){
				assert.notOk(err);
				assert.deepEqual(password.password, expected_password);
				done();
			});
		});
	});
});