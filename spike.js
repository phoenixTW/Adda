// // function updateClass(url){
// //     $.ajax({
// //         url: url,
// //         dataType: "HTML",
// //         error: function(msg){
// //             alert(msg.statusText);
// //             return msg;
// //         },
// //         success: function(html){
// //             $("#container").html(html);
// //         }
// //     });
// // };

// // function refreshClass(){
// //             updateClass("http://fiddle.jshell.net/sijav/mQB5E/5/show/"); //update the class
// // };


// // var pra = function(x){
// //     return x+' foooo'
// // };

// // function Tree(name,fest) {
// //   this.name = name;
// //   this.festival = fest;
// //   this.num = name;
// // };

// // Tree.__proto__= {
// //     '1':function(x,y){
// //         return x+" hello "+this.num;
// //     }
// // };

// // var theTree = new Tree(5,pra);
// // console.log('theTree.constructor is ' + theTree.1('hiiiiii'));
// // console.log(Tree)
// // var obj ={ 
// //     "number":function(num){
// //         return [12,3,4,5];
// //     }
// // }


// // (1).__proto__.num = obj.number ;
// // console.log((1).num());

// var exec = require('child_process').exec,
//     child;

// child = exec('cat *.js spike.js | wc -l',
//   function (error, stdout, stderr) {
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
// });

var arr1 = [
    { name: "a", age: 24},
    { name: "b", age: 21},
    { name: "a", age: 22},
    { name: "b", age: 24}
];

var arr2 = [];
arr2.push(arr1[0]);
arr1.forEach(function(x){
	arr2.every(function(y){
		return x.age != y.age;
	}) && arr2.push(x);
});

console.log(arr2);

//a.forEach(function(x){result.every(function(y){return x!=y}) && result.push(x)})