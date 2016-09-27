var redis = require("redis"),
    client = redis.createClient(),
    client2 = redis.createClient();

exports.throw = function(bottle,callback){
  bottle.time = bottle.time || Date.now();

  var bottleId = Math.random().toString(16);
  var type = {
    male:0,
    female:1
  };
  client.SELECT(type[bottle.type],function(err,result){
    
    client.HMSET(bottleId,bottle,function(err,result){
      console.log("======result start==========")
      console.log(result)
      console.log("======result end==========")

      if (err) {
        return callback({
          code:0,
          msg:"过会再试试吧！"
        });
      }
      callback({
        code:1,
        msg:result
      });

      client.EXPIRE(bottleId,86400);
    });
  })
}

exports.pick = function(info,callback){
  if (Math.random() <= 0.2) {
    return callback({
      code:0,
      msg:"海星"
    });
  }
  var type = {
    all:Math.round(Math.random()),
    male:0,
    female:1
  }
  info.type = info.type || "all";
  client.SELECT(type[info.type],function(){
    client.RANDOMKEY(function(err,bottleId){
      if (!bottleId) {
        return callback({
          code:0,
          msg:"海星"
        });
      }
      client.HGETALL(bottleId,function(err,bottle){
        if (err) {
          return callback({
            code:0,
            msg:"漂流瓶破损了..."
          });
        }

        callback({
          code:1,
          msg:bottle
        });
        client.DEL(bottleId);
      });
    });
  });
}

exports.throwBack = function(bottle,callback){
  var type = {male:0,female:1};
  var bottleId = Math.random().toString(16);

  client.SELECT(type[bottle.type],function(){
    client.HMSET(bottleId,bootle,function(err,result){
      if (err) {
        return callback({
          code:0,
          msg:"过会儿再试试吧！"
        });
      }
      callback({
        code:1,
        msg:result
      });
      client.PEXPIRE(bottleId,bottle.time + 86400000 - Date.now());
    });
  });
}