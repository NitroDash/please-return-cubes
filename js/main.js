var canvas, ctx;

const DEBUG_RNG_SEED = null;
const DEBUG_CRASH_ON_ERROR = true;
const DEBUG_WARN_ON_ERROR = true;

var image = {};

var cubes = [];
var colorGrids = [];

function loadJSON(filename,callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', filename, true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
          }
    };
    xobj.send(null);
 }

function loadImage(filename, callback) {
    let img = document.createElement("img");
    img.onload = function() {callback(img)}
    img.src = filename;
}

function startImageLoad(name) {
    if (!image[name]) loadImage(`img/${name}.png`,function(img) {image[name] = img});
}

function loadFiles(loads, callback) {
    var result = [];
    var toLoad = loads.length;
    loads.forEach(function(load,i) {
        switch (load.type) {
            case "json":
                loadJSON(load.filename,function(res) {
                    result[i] = res;
                    if (--toLoad <= 0) {
                        callback(result);
                    }
                });
                break;
            case "img":
                loadImage(load.filename,function(res) {
                    result[i] = res;
                    if (--toLoad <= 0) {
                        callback(result);
                    }
                });
                break;
            default:
                console.log(`Load of file ${load.filename} failed: no type`);
                toLoad--;
                break;
        }
    });
}

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    startImageLoad("cube");
    cubes.push(new RotateCube(250, 400));
    cubes.push(new RotateCube(1300, 400));
    colorGrids.push(new ColorGrid(150, 100));
    colorGrids.push(new ColorGrid(130, -80));
    requestAnimationFrame(updateAndRender);
}

var lastTime = 0;

function updateAndRender(time) {
    update(time - lastTime);
    render();
    lastTime = time;
    requestAnimationFrame(updateAndRender);
}

function update(dt) {
    for (var i = 0; i < cubes.length; i++) {
        cubes[i].update(dt);
    }
    for (var i = 0; i < colorGrids.length; i++) {
        colorGrids[i].update(dt);
    }
}

function render() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.globalCompositeOperation = "exclusion";
    for (var i = 0; i < colorGrids.length; i++) {
        colorGrids[i].render(ctx);
    }
    ctx.globalCompositeOperation = "source-over";
    
    ctx.font = "200px serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Please", canvas.width/2, 300);
    ctx.fillText("Return", canvas.width/2, 500);
    ctx.fillText("Cubes", canvas.width/2, 700);
    for (var i = 0; i < cubes.length; i++) {
        cubes[i].render(ctx);
    }
}

function renderEntities(ctx) {
    entities.sort((a,b) => {return a.getRenderDepth() - b.getRenderDepth()});
    entities.forEach(entity => {
        entity.render(ctx);
    })
}

init();