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
				userId: 1,
				topicId: 1,
				time: '02/03/2014'
			};

			var expectedComment = [
				{ 	topic_id: "1",
					comment: 'nice game',
					userId: "1",
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

		it('should give 54321 for prasenjitc@gmail.com',function(done){
			var email_id = "prasenjitc@gmail.com";
			var expected_password = "54321";
			adda_records.getPassword(email_id, function(err,password){
				assert.notOk(err);
				assert.deepEqual(password.password, expected_password);
				done();
			});
		});

		it('should give error for wrong@gmail.com',function(done){
			var email_id = "wrong@gmail.com";
			adda_records.getPassword(email_id, function(err,password){
				assert.notOk(err);
				done();
			});
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

	describe('#addTopic',function(){
		it('insert new topic into topics table along with userId and time',function(done){
			var topic = {
				name: 'hocky',
				description: 'hocky is our national game',
				userId: 1,
				start_time:"GMT 15:30",
			};

			var callback = function(error,topicInfo){
				assert.notOk(error);
				topic.id = 4;
				topic.end_time = null;
				assert.deepEqual(topicInfo[3],topic);
				done();
			};

			adda_records.addTopic(topic, function(err){
				assert.notOk(err);
				adda_records.getTopicInfo(callback);
			});
		});
	});

	describe('#searchTopics',function(){
		it('should give all topics started with step',function(done){
			var expected_topics = [{id:1,name:'step'},{id:2,name:'step of success'}]
			
			adda_records.searchTopics('ste', function(err,topics){
				assert.notOk(err);
				assert.deepEqual(expected_topics, topics);
				done();
			});
		});
	});

	describe('#getUserInfo',function(){
		it('should give all users in registration table',function(done){
			var expected = [{
				  "email_id": "kaustav.ron@gmail.com",
				  "name": "Kaustav Chakraborty",
				  "password": "12345",
				  "id": 1
				},
				{
				  "email_id": "prasenjitc@gmail.com",
				  "name": "Prasenjit Chakraborty",
				  "password": "54321",
				  "id": 2
				}
			];

			var callback = function(error, users) {
				assert.notOk(error);
				assert.lengthOf(users, 2);
				assert.deepEqual(users, expected);
				done();
			};

			adda_records.getUserInfo(callback);
		});
	});

	describe('#getSingleUser',function(){
		it('should give details for Kaustav Chakraborty by kaustav.ron@gmail.com',function(done){
			var expected = {
				  "email_id": "kaustav.ron@gmail.com",
				  "name": "Kaustav Chakraborty",
				  "password": "12345",
				  "id": 1
			};

			var callback = function(error, user) {
				assert.notOk(error);
				assert.deepEqual(user, expected);
				done();
			};

			adda_records.getSingleUser('kaustav.ron@gmail.com',callback);
		});

		it('should give details for Prasenjit Chakraborty by prasenjitc@gmail.com',function(done){
			var expected = {
				  "email_id": "prasenjitc@gmail.com",
				  "name": "Prasenjit Chakraborty",
				  "password": "54321",
				  "id": 2
			};

			var callback = function(error, user) {
				assert.notOk(error);
				assert.deepEqual(user, expected);
				done();
			};

			adda_records.getSingleUser('prasenjitc@gmail.com',callback);
		});

		it('should give error for Wrong Name by anything@gmail.com',function(done){

			var callback = function(error, user) {
				assert.notOk(error);
				done();
			};

			adda_records.getSingleUser('anything@gmail.com',callback);
		});

	});	

	describe('#getAllTopics',function(){
		it('should give all topics',function(done){
			var expected_topics = [{id:1,name:'step'},{id:2,name:'step of success'},{id:3,name:'soda'},{id:4,name:'hocky'}]
			adda_records.getAllTopics(function(err,topics){
				assert.notOk(err);
				assert.deepEqual(expected_topics,topics);
				done();
			});
		});
	});

	describe('#getTopics',function(){
		it('should give the of name and id of a specific topicId ',function(done){
			var userId = 1;
			var expected_topics = [{"name":"step",id:1},{"name":"soda",id:3},{"name":"hocky",id:4}];
			adda_records.getTopics(userId,function(err,topic){
				assert.notOk(err);
				assert.deepEqual(topic,expected_topics);
				done();
			});
		});
	});
	describe('#top 5 Active Topics',function(){
		it('should give 5 Active Topics',function(done){
			var expected_topics = [{id:4,name:"hocky",description:"hocky is our national game"},
			{id:3,name:"soda",description:"how to make drink"},
			{id:2,name:"step of success",description:"nobel thought"},
			{id:1,name:"step",description:"software technology excelence program"}];
			adda_records.top5ActiveTopics(function(err,topic){
				assert.notOk(err);
				assert.deepEqual(topic,expected_topics);
				done();
			});
		});
	});
	describe('#getTopicId',function(){
		it('should give Id of a topic by given topic',function(done){
			adda_records.getTopicId("soda",function(err,topicId){
				assert.notOk(err);
				assert.deepEqual({"max(id)":3},topicId);
				done();
			});
		});
		it('should give Id of a topic by given topic',function(done){
			adda_records.getTopicId("step",function(err,topicId){
				assert.notOk(err);
				assert.deepEqual({"max(id)":1},topicId);
				done();
			});
		});
	});
});