var exec = require('child_process').exec;


var sound = function(){
	exec("vlc  sound/alert.mp3",function(te_err, std__out, std__err){
		console.log(std__err);
	});
};

var runTest = function(){
	exec('npm run test',function(te_err, std__out, std__err){
		(!std__err) && console.log("update successfull");
		if(std__err){
			exec("git --no-pager show -s --format='%an <%ae>'| cut -c10-15",function(er,st_out,st_err){
				console.log(st_out);
				sound();
			})
			
		}
	})
}

var pullcommit = function(){
	exec('git pull',function(te_err, std__out, std__err){
		console.log(std__err);
		runTest();
	})
};

var server = function(){
	exec('git ls-remote https://github.com/phoenixTW/Adda.git HEAD | cut -c1-40',
		function(err, stdout, stderr){
			exec('git rev-parse HEAD',function(error, std_out, std_err){
				(std_out!=stdout) && pullcommit();
				(std_out==stdout) && console.log("up-todate");
			})
	});
};

var runServer = function(){
	for(var i=0; ; i++){
		(i%50==0) && server();
	}
}
runServer();