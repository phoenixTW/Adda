var exec = require('child_process').exec;


var sound = function(){
	exec("vlc  sound/alert.mp3 vlc://quit",function(te_err, std__out, std__err){
	});
};

var runTest = function(){
	exec('npm run test',function(te_err, std__out, std__err){
		(!std__err) && console.log("update successfull");
		(std__err) && sound();
		
	})
}

var pullcommit = function(){
	exec('git pull',function(te_err, std__out, std__err){
		console.log(std__err);
		console.log(std__out);
		runTest();
	})
	runTest();
};

var server = function(){
	console.log("CI-server is running.");
	exec('git ls-remote https://github.com/phoenixTW/Adda.git HEAD | cut -c1-40',
		function(err, stdout, stderr){
			exec('git rev-parse HEAD',function(error, std_out, std_err){
				(std_out!=stdout) && pullcommit();
				(std_out==stdout) && console.log("up-todate");
			})
	});
};

server();