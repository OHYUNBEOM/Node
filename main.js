var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname=url.parse(_url,true).pathname;
    if(pathname==='/')//root page 접속
    {
        if(queryData.id===undefined)
        {
            fs.readdir('./data',function(error, filelist){
            var title='Welcome';
            var description = 'Hello, Node.js';
            var list='<ul>';
            var i=0;
            while(i < filelist.length){
                list= list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;//list 목록에 filelist에 해당되는것 추가
                i=i+1;
            }

            list=list+'</ul>';
            var template = `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list} 
                    <h2>${title}</h2>
                    <p>${description}</p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
                // 다음과 같은 작업을 통해서 data file 에 file 이 추가될 때 마다 알아서 원래의 형식에 맞도록 업로드가 되고 사용자가 수정해줄 필요가 없어짐
            })
        }
        else
        {
            fs.readdir('./data',function(error, filelist){
                var title='Welcome';
                var description = 'Hello, Node.js';
                var list='<ul>';
                var i=0;
                while(i < filelist.length){
                    list= list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;//list 목록에 filelist에 해당되는것 추가
                    i=i+1;
                }
                list=list+'</ul>';

            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                var title = queryData.id;
                var template = `
                    <!doctype html>
                    <html>
                    <head>
                        <title>WEB1 - ${title}</title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>${description}</p>
                    </body>
                    </html>
                    `;
                    response.writeHead(200);
                    response.end(template);
                });
            });//fs.readdir 끝나는 부분
        }
    }
    else
    {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);