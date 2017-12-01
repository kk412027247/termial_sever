const fs = require
const str = '品牌1 型号1 可信度1 新可信度1 品牌2 型号2 可信度2 新可信度2 品牌3 型号3 可信度3 新可信度3 品牌4 型号4 可信度4 新可信度4 品牌5 型号5 可信度5 新可信度5 品牌6 型号6 可信度6 新可信度6 品牌7 型号7 可信度7 新可信度7';
const arr = str.split(' ');

const _doc = arr.reduce((pre,curr)=>({
  ...pre,[curr]:curr
}),{});

console.log(_doc);
