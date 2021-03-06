var http = require('http');
var fs = require('fs');
var url = require('url');
var qs= require('querystring');
function templateHTML(title, list,body,control)//코드 재사용
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
        ${control}
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
var app = http.createServer(function(request,response){//request:요청할 때 웹브라우저가 보낸정보 , response: 응답할 때 우리가 웹브라우저에 전송할 정보
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
            var template = templateHTML(title,list,`<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
            ); // 동일한 코드를 함수화
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
                var template = templateHTML(title,list,
                `<h2>${title}</h2>${description}`,
                `<a href="/create">create</a>
                <a href="/update?id=${title}">update</a>
                <form action="delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                </form>`
                //update 클릭 이후 update 된 해당 id 를 알기위해 ?id=${title}추가\
                //delete button 생성
                );
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
            <form action="/create_process" method="post"> 
            <!-- method 방식을 post로 주게되면 query 주소는 넘어오지않고 내가 지정한 action 의 주소만 넘어온다 -->
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
            `,''); // 동일한 코드를 함수화 
            response.writeHead(200);
            response.end(template);
            });
    }
    else if(pathname==="/create_process")//post 방식으로 들어온 data 를 받아옴
    {
        var body='';
        request.on('data',function(data){
            body+=data;//callback 이 실행될때마다 기존의 내용에 data 를 추가해준다
        });
        request.on('end',function(){
            var post=qs.parse(body);//callback 끝났을 때 post 에 그동안 추가된 body 를 저장
            var title=post.title;
            var description=post.description;
            fs.writeFile(`data/${title}`,description,'utf8',function(err){
                response.writeHead(302,{Location:`/?id=${title}`});//200은 성공했다는 뜻이고 302는 페이지를 다른곳으로 redirection 시켜라는 말
                response.end();//Header 를 302 로 보냄으로써 페이지를 다른곳으로 redirection 시키고, 어디로 시키냐 --> 내가 새로 create 한 title 에 대한 title과 description 을 보여주기위해 Location 을 ${title}로 지정
            })
        });
    }
    else if(pathname==='/update')
    {
        fs.readdir('./data',function(error, filelist){
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = templatelist(filelist);
                var template = templateHTML(title,list,
                `
                <form action="/update_process" method="post"> 
                <input type="hidden" name="id" value="${title}">
                <!-- hidden 이라는 타입으로 기존의 title을 저장해둔다 -->
                <!-- method 방식을 post로 주게되면 query 주소는 넘어오지않고 내가 지정한 action 의 주소만 넘어온다 -->
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
                //update 클릭 이후 update 된 해당 id 를 알기위해 ?id=${title}추가
                    response.writeHead(200);
                    response.end(template);
                });
            });
    }
    else if(pathname==='/update_process')
    {
        var body='';
        request.on('data',function(data){
            body+=data;//callback 이 실행될때마다 기존의 내용에 data 를 추가해준다
        });
        request.on('end',function(){
            var post=qs.parse(body);//callback 끝났을 때 post 에 그동안 추가된 body 를 저장
            var id = post.id;
            var title=post.title;
            var description=post.description;
            fs.rename(`data/${id}`,`data/${title}`,function(){//css부분에서 title 을 수정했을때 css-->사용자가 바꾼 title 로 변경한다는 의미
                fs.writeFile(`data/${title}`,description,'utf8',function(err){
                    response.writeHead(302,{Location:`/?id=${title}`});//200은 성공했다는 뜻이고 302는 페이지를 다른곳으로 redirection 시켜라는 말
                    response.end();//Header 를 302 로 보냄으로써 페이지를 다른곳으로 redirection 시키고, 어디로 시키냐 --> 내가 새로 create 한 title 에 대한 title과 description 을 보여주기위해 Location 을 ${title}로 지정
                })
            })
        });
    }
    else if(pathname==='/delete_process')
    {
        var body='';
        request.on('data',function(data){
            body+=data;//callback 이 실행될때마다 기존의 내용에 data 를 추가해준다
        });
        request.on('end',function(){
            var post=qs.parse(body);
            var id = post.id;//delete 는 id 값만 전송되기에 title 과 description은 필요없음
            fs.unlink(`data/${id}`,function(error){//fs.unlink --> file 을 삭제하는 뜻 원래함수형태 : fs.unlink(path,function);
                response.writeHead(302,{Location:`/`});//302는 페이지를 다른곳으로 redirection 시켜라는 말
                response.end();
            })
            
        });
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
