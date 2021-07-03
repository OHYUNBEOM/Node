var http = require('http');
var fs = require('fs');
var url = require('url');
function templateHTML(title, list,body)//코드 재사용
{
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB</a></h1>
        ${list} 
        <a href="/create">create</a>
        ${body}
    </body>
    </html>
    `;
}
function templatelist(filelist)
{
    var list='<ul>';
    var i=0;
    while(i < filelist.length){
        list= list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;//list 목록에 filelist에 해당되는것 추가
        i=i+1;
    }
    list=list+'</ul>';
    return list;
}
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
            var list = templatelist(filelist);
            var template = templateHTML(title,list,`<h2>${title}</h2>${description}`); // 동일한 코드를 함수화
            //templateHTML 함수를 호출하는데 내가 지정해둔 title,list를 순차적으로 가져오고 크게 잡은 body 태그부분이 title 과 그에 해당하는 description 을 불러옴
                response.writeHead(200);
                response.end(template);
                // 다음과 같은 작업을 통해서 data file 에 file 이 추가될 때 마다 알아서 원래의 형식에 맞도록 업로드가 되고 사용자가 수정해줄 필요가 없어짐
            })
        }
        else
        {
            fs.readdir('./data',function(error, filelist){
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = templatelist(filelist);
                var template = templateHTML(title,list,`<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template);
                });
            });//fs.readdir 끝나는 부분
        }
    }
    else if(pathname==="/create")
    {
        fs.readdir('./data',function(error, filelist){
            var title='WEB - CREATE';
            var list = templatelist(filelist);
            var template = templateHTML(title,list,`
            <form action="http://localhost:3000/process_create" method="post"> 
            <!-- method 방식을 post로 주게되면 query 주소는 넘어오지않고 내가 지정한 action 의 주소만 넘어온다 -->
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
            `); // 동일한 코드를 함수화
                response.writeHead(200);
                response.end(template);
            })
    }
    else
    {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);

//npm 이 지원하는 pm2 를 통해 node main.js 와 같이 main 파일을 실행시킬 수 있다
//google 에 pm2 검색 후 npm 명령어를 통해 install
//pm2 start main.js-->지정한 localhost에 실행되는것을 확인
