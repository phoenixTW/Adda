// var exec = require('child_process').exec;


// var sound = function(){
// 	exec('echo hello',function(te_err, std__out, std__err){
// 		console.log(std__err);
// 	});
// };

// var runTest = function(){
// 	exec('npm run test',function(te_err, std__out, std__err){
// 		console.log(std__err);
// 		if(std__err){
// 			sound();
// 		}
// 	})
// }

// var pullcommit = function(){
// 	runTest();
// 	return "hiiiiiiiiii";
// };

// var server = function(){
// 	exec('git ls-remote https://github.com/phoenixTW/Adda.git HEAD | cut -c1-40',
// 		function(err, stdout, stderr){
// 			exec('git rev-parse HEAD',function(error, std_out, std_err){
// 				if(std_out!=stdout){
// 					pullcommit();
// 				}
// 			})
// 	});
// 	return "12";
// };

// console.log(server());