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

	describe('#postComment',function(){
		it('insert "nice game" by Kaustav Chakraborty into comments table',function(done){
			var post = {
				comment: 'nice game',
				userId: '1',
				topicId: '1',
				time: '02/03/2014'
			};

			var expectedComment = [
				{ 	topic_id: 1,
					comment: 'nice game',
					userId: 1,
					time: '02/03/2014'
				}
			];

			var retriveComments = function(err, comments) {
				assert.notOk(err);
				assert.deepEqual(comments, expectedComment);
				done();
			};

			var callback = function(error){
				assert.notOk(error);
				adda_records.getComments('1', retriveComments);
			};
			adda_records.postComment(post, callback)
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

	describe('queryParser', function () {
		describe('#selectQueryMaker', function() {
			it('should return select * from tableName if no data is given', function () {
				var expectedQuery = 'select * from tableName;';
				assert.deepEqual(lib.queryParser.selectQueryMaker('tableName'), expectedQuery);
			});

			it('should return select field from tableName if field is given as select object', function () {
				var expectedQuery = 'select field from tableName;';
				assert.deepEqual(lib.queryParser.selectQueryMaker('tableName', ['field']), expectedQuery);
			});

			it('should return select field from tableName where email = "kaustav.ron@gmail.com" if field is given as select object', function () {
				var expectedQuery = 'select field from tableName where email = "kaustav.ron@gmail.com";';
				assert.deepEqual(lib.queryParser.selectQueryMaker('tableName', ['field'], {email: 'kaustav.ron@gmail.com'}), expectedQuery);
			});

			it('should return select field1, field2 from tableName where email = "kaustav.ron@gmail.com" and name = "Kaustav Chakraborty" if field is given as select object', function () {
				var expectedQuery = 'select field1, field2 from tableName where email = "kaustav.ron@gmail.com" and name = "Kaustav Chakraborty";';
				assert.deepEqual(lib.queryParser.selectQueryMaker('tableName', ['field1', 'field2'], {
					email: 'kaustav.ron@gmail.com',
					name: 'Kaustav Chakraborty'
				}), expectedQuery);
			});
		});

		describe('#insertQueryMaker', function() {
			it('should return insert into tableName values ("value1", "value2") if no data is given', function () {
				var expectedQuery = 'insert into tableName values("value1", "value2");';
				assert.deepEqual(lib.queryParser.insertQueryMaker('tableName', ['value1', 'value2']), expectedQuery);
			});

			it('should return insert into (field1, field2) tableName values ("value1", "value2") if field is given as select object', function () {
				var expectedQuery = 'insert into tableName (field1, field2) values("value1", "value2");';
				assert.deepEqual(lib.queryParser.insertQueryMaker('tableName', ['value1', 'value2'], ['field1', 'field2']), expectedQuery);
			});
		});

	});
	});
	describe('#searchTopics',function(){
		it('should give all topics started with step',function(done){
			var expected_topics = [{name:'step'},{name:'step of success'}]
			adda_records.searchTopics('ste', function(err,topics){
				console.log("aaaaaaaaaaaaaaaaa",topics)
				assert.notOk(err);
				assert.deepEqual(expected_topics, topics);
				done();
			});
		});
	});
});