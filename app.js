var express = require("express");
var redis = require("./models/redis");
var bodyParser = require("body-parser");
var mongodb = require("./models/mongodb");

var app = express();
app.use(bodyParser());

//扔一个漂流瓶
app.post("/",function(req,res){
  if (!(req.body.owner && req.body.type && req.body.content)) {
    console.log("======req.body start==========")
    console.log(req.body)
    console.log("======req.body end==========")
    if (req.body.type && (["male","female"].indexOf(req.body.type)===-1)) {
      return res.json({
        code:0,
        msg:"类型错误"
      });
    }
    return res.json({
      code:0,
      msg:"信息不完整"
    }); 
  }

  redis.throw(req.body,function(result){
    res.json(result);
  });
});

//捡一个漂流瓶
app.get("/",function(req,res){
  if (!req.query.user) {
    return res.json({
      code:0,
      msg:"信息不完整"
    });
  }
  if (req.query.type && (["male","female"].indexOf(req.query.type)===-1)) {
    return res.json({
      code:0,
      msg:"类型错误"
    });
  }
  redis.pick(req.query,function(result){
    if (result.code===1) {
      mongodb.save(req.query.user,result.msg,function(err){
        if (err) {
          return res.json({
            code:0,
            msg:"获取漂流瓶失败，请重试"
          });
        }
        return res.json(result);
      });
    }
    res.json(result);
  });
});

app.post("/back",function(req,res){
  redis.throwBack(req.body,function(result){
    res.json(result);
  });
});

app.get("/user/:user",function(req,res){
  mongodb.getAll(req.params.user,function(result){
    res.json(result);
  });
});

app.get("/bottle/:_id",function(req,res){
  mongodb.getOne(req.params._id,function(result){
    res.json(result);
  });
});

app.post("/reply/:_id",function(req,res){
  if (!(req.body.user && req.body.content)) {
    return callback({
      code:0,
      msg:"回复信息不完整！"
    });
  }
  mongodb.reply(req.params._id,req.body,function(result){
    res.json(result);
  });
});

app.listen(3000);