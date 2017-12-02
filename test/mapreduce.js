for(let i=0; i< 100; i++){
  db.t1.insert(
    {
      _id: i,
      "name": "user_"+i,
      "age" : NumberInt(Math.random() * 10)
    })
}
for(let i=0; i< 100; i++){
  db.t2.insert(
    {
      _id: i,
      "name": "user_"+i,
      "age" : NumberInt(Math.random() * 10)
    })
}

var map1 = function(){
  const obj = {t1:this.name};
  emit(this.age, obj);
};

var map2 = function(){
  const obj = {t2:this.name};
  emit(this.age, obj);
};


var reduce = function(key,values){
  var obj ={};
  values.forEach(function(item){
    if(item.hasOwnProperty('t1')){
      if(obj.t1.length===0){
        obj.t1=[]
      }
      obj.t1.push(item.t1);
    }else{
      if(obj.t2.length===0){
        obj.t2=[]
      }
      obj.t2.push(item.t2);
    }
    return obj;
  });
};





db.t.mapReduce(map1, reduce, {"out": {"reduce": "merge"}});
db.t2.mapReduce(map2, reduce, {"out": {"reduce": "merge"}});
