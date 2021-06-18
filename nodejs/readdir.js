var testFolder='./data';
var fs = require('fs');
fs.readdir(testFolder, function(error,filelist){
    console.log(filelist);
})
//cmd 에서 file 읽어올때 
//node nodejs/readdir.js 로 호출