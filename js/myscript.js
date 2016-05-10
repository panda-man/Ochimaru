// myscript.js
//ゲーム情報
const W_MAP=4;
const H_MAP=8;
const W_BLOCK_SIZE = 50;
const H_BLOCK_SIZE = 50;
const DROP_SPEED=10;
const BLOCK_NUM = 4;
const VK_DOWN = 40;
// FPS
const FPS = 1000 / 60;

var canvas;
var field;
var block;
var ctx;
var y;
var x;
var blockOutputPoint;

window.onload = function() {
	init();
}

function init() {
	canvas = document.getElementById('mycanvas');
	if (!canvas || !canvas.getContext) return false;
	ctx = canvas.getContext('2d');
	field = new Field(canvas);
    createBlock();
    setInterval(update, DROP_SPEED);
    setInterval(draw, FPS);
    // drop();
}
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	field.draw(ctx);
	block.draw(ctx);
}

function update() {

	if(isMoveBlock(VK_DOWN) == true) {
		block.down();
	} else {
		placementBlock();
	}
}
function isMoveBlock(keyCode) {
    var tmpBlock = block.clone();
    
    return field.isMove(tmpBlock);
}



var Field = function(canvas){
	this.width = W_MAP * W_BLOCK_SIZE;
	this.height = H_MAP * H_BLOCK_SIZE;
	this.field = new Array(W_MAP * H_MAP);
	for(var i = 0; i < W_MAP * H_MAP; i++) {
		this.field[i] = true;
	}
    //キャンバスサイズの変更
    canvas.width = this.width+100;
    canvas.height = this.height;
    ctx.strokeRect(0,0,this.width, this.height);

    this.draw = function (ctx) {
    	ctx.strokeRect(30, 0, this.width, this.height);
    	for(var y = 0; y < H_MAP; y++) {
    		for(var x = 0; x < W_MAP; x++) {
    			if(this.field[calcPosition(x, y)] == false) {
    				var cx = x * W_BLOCK_SIZE;
    				var cy = y * H_BLOCK_SIZE;
    				ctx.fillRect(cx, cy, W_BLOCK_SIZE, H_BLOCK_SIZE);
    			}
    		}
    	}
    }
    this.setBlock = function (block) {
    	for(var i = 0; i < BLOCK_NUM; i++) {
            // 相対座標から絶対座標へ変換
            var xPos = block.x;
            var yPos = block.y;
            // this.field[calcPosition(xPos, yPos)] = false;
        }
    }
    this.isMove = function (block) {
        for(var i = 0; i < BLOCK_NUM; i++) {
            // 相対座標から絶対座標へ変換
            var xPos = block.x;
            var yPos = block.y;
            // 壁
            if(xPos < 0 || W_MAP <= xPos ||
                yPos < 0 || H_MAP <= yPos) {
                return false;
            }
            // ブロック
            if(this.field[calcPosition(xPos, yPos)] == false) {
                return false;
            }
        }
        return true;
    }

    //----- private method
    function calcPosition(x, y) {
    	return x + (y * W_MAP);
    }
}
var Block = function (x, y) {
	this.x = x;
	this.y = y;
	this.draw = function (ctx) {
		for(var i = 0; i < BLOCK_NUM; i++) {
			var cx = this.x;
			var cy = this.y;
			ctx.fillRect(cx * W_BLOCK_SIZE, cy * H_BLOCK_SIZE, W_BLOCK_SIZE, H_BLOCK_SIZE);
		}
	}
	//ブロックダウン
	this.down = function () {
        ++this.y;
    }
	this.clone = function () {
		var block = new Block;
		for(var prop in this) {
			block[prop] = this[prop];
		}
		return block;
	}
	this.getBlockData = function (x, y) {
		var cx = this.x;
		var cy = this.y;
	}

    //----- private method
    function calcPosition(x, y) {
    	return x + (y * W_BLOCK);
    }
}
// ブロックを作成する
function createBlock() {
	blockOutputPoint = Math.floor(Math.random()*(200))-30
	block = new Block(blockOutputPoint, 0);
}
function placementBlock() {
    field.setBlock(block);
}



function drop(){
	field.y = 0+30;
	field.x = Math.floor(Math.random()*(200))+30;

	(function loop() {
		ctx.clearRect(0,0,canvas.width,canvas.height);
		field.draw(ctx);
		if (y > canvas.height) y = -50;
		y++;
		ctx.fillRect(x,y,30,30);
		setTimeout(loop,DROP_SPEED);
	})();
}