//const a =[1];

// function *fun(){
//   yield console.log(a);
//   yield a.push([2]);
//   yield console.log(a[1]);
//   yield a[1].push([3]);
//   yield console.log(a[1][1]);
//   yield a[1][1].push([4]);
//   yield console.log(a[1][1][1]);
//   yield a[1][1][1].push([5]);
//   yield console.log(a[1][1][1][1]);
//   yield a[1][1][1][1].push([6]);
//   yield console.log(a[1][1][1][1][1]);
//   yield a[1][1][1][1][1].push([7]);
//   yield console.log(a[1][1][1][1][1][1]);
//   return 'success!'
// }

// for...of循环可以自动遍历 Generator 函数时生成的Iterator对象，且此时不再需要调用next方法。
// for(let value of fun()){
//   let a = value;
// }


const asyncFunc=  async () => {
  const a=[1];
  await console.log(a);
  await a.push([2]);
  await console.log(a[1]);
  await a[1].push([3]);
  await console.log(a[1][1]);
  await a[1][1].push([4]);
  await console.log(a[1][1][1]);
  await a[1][1][1].push([5]);
  await console.log(a[1][1][1][1]);
  await a[1][1][1][1].push([6]);
  await console.log(a[1][1][1][1][1]);
  await a[1][1][1][1][1].push([7]);
  await console.log(a[1][1][1][1][1][1]);
  return a;
};



asyncFunc().then(console.log).catch(err=>console.log('err: ',err));

// const fs = require('fs');
// const fsAsync = async ()=>{
//   await fs.readFile('./1.txt',{encoding: 'utf8'},(err,result)=>{console.log(result)});
//   await fs.readFile('./2.txt',{encoding: 'utf8'},(err,result)=>{console.log(result)});
//   await fs.readFile('./3.txt',{encoding: 'utf8'},(err,result)=>{console.log(result)});
// };
//
// fsAsync();
