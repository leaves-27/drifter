var express = require("express");
var redis = require("./models/redis");
var bodyParser = require("body-parser");

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
    res.json(result);
  });
});

app.listen(3000);