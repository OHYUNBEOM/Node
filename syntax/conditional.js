var args=process.argv;
//사용자에게 입력받는값
console.log(args[2]);
console.log('A');
console.log('B');
if(args[2]==='1')//1이면 true 로 판단/ C1 출력
{
    console.log('C1');
}
else// 그 외 false로 판단/ C2 출력
{
    console.log('C2');
}
console.log('D');