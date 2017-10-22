### 回调嵌套使用 generator 来解决，好赞！！！！
### 然而async 更加好用!!!! 从此和回调地狱说拜拜。一句话解释async，它就是 Generator 函数的语法糖

### 然而把异步转化为同步，在superAgent改真的很复杂，算了，还是用回调地狱，这样比较方便。

### mongoose 添加静态方法
``` this 这里指的是model,操作数据库用的，这是官方的教程写法。
    getListSchema.static.getList = (list, callback)=>{
      this.create(list,callback);
    };
