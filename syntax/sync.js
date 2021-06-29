var fs=require('fs');

// //readFileSync
// console.log('A');
// var result=fs.readFileSync('syntax/sample.txt','utf8');
// console.log(result);
// console.log('C');
// //cd C:\Users\Windows 10\Desktop\nodejs
// //node syntax/sync.js 
// //로 실행


console.log('A');
fs.readFile('syntax/sample.txt','utf8',function(err,result){
    console.log(result);
});
console.log('C');

//readFileSync 와 readFile 의 차이점 
//readFilcSync 는 return 값이 있고, readFileSync 는 return값이 없지만 
//해당 부분이 실행되면 함수의 result 값으로 해당 부분이 삽입되고, 오류가 있다면 err로 받는다