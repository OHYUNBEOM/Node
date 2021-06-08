var http = require('http');
var fs = require('fs');
var url=require('url');
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData=url.parse(_url,true).query;
    //query data 에 들어가는 id --> 해당 id 가 들어감
    if(_url == '/'){
        _url = '/index.html';
    }
    if(_url == '/favicon.ico'){
        return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + _url));

});
app.listen(3000);
//Setting
//터미널에 node main.js 를 통해서 localhost 를 만들고
//해당 로컬호스트는 app.listen(?) 의 ? 부분