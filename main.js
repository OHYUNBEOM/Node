var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request,response){
    var url = request.url;
    if(request.url == '/'){
        url = '/index.html';
    }
    if(request.url == '/favicon.ico'){
        return response.writeHead(404);
    }
    response.writeHead(200);
    console.log(__dirname + url);
    response.end(fs.readFileSync(__dirname + url));

});
app.listen(3000);
//Setting
//터미널에 node main.js 를 통해서 localhost 를 만들고
//해당 로컬호스트는 app.listen(?) 의 ? 부분