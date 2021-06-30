// function a()
// {
//     console.log('A');
// }
var a = function()
{
    console.log('A');
}//함수가 값이다

function slowfunc(callback)
{
    callback();
}
slowfunc(a);//slowfunc 가 실행이 되고 callback 이라는 파라미터는 a 가 가르키는 함수를 갖게됨 