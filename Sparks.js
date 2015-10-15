var stage;
var time = Date.now();
var emitter = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 5
};


var sparkPool;

var sparkLength = 50;
var sparkSpeed = 1;
var sparkCreationSpeed = .01; //in seconds
var sparkLifeTime = 1.5 //in seconds
var timer = 0;
var glowThickness = 4;

window.onload = function(){
  canvas = document.getElementById("myCanvas");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  stage = new createjs.Stage("myCanvas");
  createjs.Ticker.framerate  = 60;
  createjs.Ticker.addEventListener("tick", handleTick);
  sparkPool = new SparkPool();
  sparkPool.init();
}

function handleTick(event){
  if(!event.paused){
    update(event.delta);
  }
}

function update(dt) {
  timer += dt;
  if(timer > sparkCreationSpeed * 1000){
      createSpark();
      timer = 0;
  }

    sparkPool.update(dt);

    stage.update();
}

function createSpark(){
  var endX = -(sparkLength/2) + Math.random() * sparkLength;
  var endY = -(sparkLength/2) + Math.random() * sparkLength;

  //var speedX = -(sparkSpeed/2) + Math.random() * sparkSpeed;
  //var speedY = -(sparkSpeed/2) + Math.random() * sparkSpeed;

  var speedX = endX / 15;
  var speedY = endY / 15;



  sparkPool.create(emitter.x, emitter.y, endX, endY, speedX, speedY);
}



function Spark(){
  this.inUse = false;
  this.x1;
  this.x2;
  this.y1;
  this.y2;
  this.speedX;
  this.speedY;

  this.time = 0;
  var spark;

  this.init = function(x1, y1, x2, y2, speedX, speedY){
    this.inUse = true;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.speedX = speedX;
    this.speedY = speedY;
    this.time = 0;
    //console.log("Created spark at (" + x1 + "," + y1 + "), (" +x2 + "," + y2 + ") with speed (" + speedX + "," + speedY + ")");
    spark = new createjs.Shape();



      spark.graphics.beginStroke("yellow");
      spark.graphics.setStrokeStyle(1);
      spark.graphics.moveTo(this.x1, this.y1).lineTo(this.x1 + this.x2, this.y1 + this.y2).endStroke();
    stage.addChild(spark);
  }

  this.update = function(dt){
    this.time += dt;
    //console.log("Time " + this.time);
    spark.graphics.clear();
    if(this.time > sparkLifeTime * 1000){
      console.log("Spark Died");
      stage.removeChild(spark);
      this.inUse = false;
    }

    //spark.graphics.clear();
    this.x1 += (this.speedX *dt);
    //this.x2 += (this.speedX *dt);
    this.y1 += (this.speedY *dt);
    //this.y2 += (this.speedY *dt);
    spark.graphics.setStrokeStyle(1);
    spark.graphics.beginStroke("yellow");

    spark.graphics.moveTo(this.x1, this.y1).lineTo(this.x1 + this.x2, this.y1 + this.y2).endStroke();

  }
}

function SparkPool(){
  var size = 100;
  var pool = [];
  var lastAccessed = 0;

  this.init = function(){
    for(var i = 0; i <= size; i ++){
      pool[i] = new Spark();
    }
  }

  this.create = function(x1, y1, x2, y2, speedX, speedY){
    //Find the first empty element
    for(var i = 0; i <= size; i++){

      if(pool[(i + lastAccessed) % size] === undefined){
        console.log("pool[" + (i + lastAccessed%size)+ "] is undefined. i = " + i + ", lastAccessed = "+ lastAccessed );
      }
      if(!pool[(i + lastAccessed)%size].inUse){
        pool[(i + lastAccessed) % size].init(x1, y1, x2, y2, speedX, speedY);
        lastAccessed = (i + lastAccessed) % size;
        //console.log("Created spark at " + i + ", last accessed is " + lastAccessed);
        break;
      } else {
        //console.log(i + " is in use");
      }
    }
  }

  this.update = function(dt){
    for(var i = 0; i <= size; i++){
      if(pool[i].inUse){
        pool[i].update(dt);
      }
    }
  }
}
