### 回调嵌套使用 generator 来解决，好赞！！！！
### 然而async 更加好用!!!! 从此和回调地狱说拜拜。一句话解释async，它就是 Generator 函数的语法糖



### mongoose 添加静态方法
``` 
this 这里指的是model,操作数据库用的，这是官方的教程写法。
getListSchema.static.getList = (list, callback)=>{
  this.create(list,callback);
};
```

### utf8文件转码gbk
```
const buffer = fs.readFileSync(file);
fs.writeFileSync(file,iconv.encode(buffer,'GB18030'));
```

### mongoose坑处
mongoose用promise 找出来的内容，查询结果文档在_doc里面，好坑，切记。

### 查找时间范围方法

```
db.getCollection('updates').find({date:{$gte:ISODate("2017-12-02"),$lt:ISODate("2017-12-03")}})
```

### cookies会根据请求地址不同，而不同？？
