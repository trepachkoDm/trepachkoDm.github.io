// canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//находим центр
var x = canvas.width/2;
var y = canvas.height-30;
//счет
var score = 0;
var lives = 1;

//параметры мяча
var speed = 1;
var dx = speed;
var dy = -speed;
var ballRadius = 10;
// параметры платформы
var platformHeight = 10;
var platformWidth = 75;
var platformX = (canvas.width-platformWidth)/2;
var rightPressed = false;
var leftPressed = false;

//параметры блоков
var blockRow = 3;
var blockColumn = 5;
var blockWidth = 75;
var blockHeight = 20;
var blockPadding = 10;
var blockOffsetTop = 30;
var blockOffsetLeft = 30;

var TouchShiftX = 0;

//управление
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchstart", BallTouchStart, false);
document.addEventListener("touchmove", BallTouchMove, false);
document.addEventListener("touchend", BallTouchEnd, false);


function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        platformX = relativeX - platformWidth/2;
    }
}

    BallTouchStart = function (e) {
    e.preventDefault();

    var TouchH = e.targetTouches[0];
    TouchShiftX = platformX.TouchStart(TouchH.pageX);
};

    BallTouchEnd = function (e) {
    e.preventDefault();
};

    BallTouchMove = function (e) {
    e.preventDefault();
    var TouchH = e.targetTouches[0];
    var relativeX = TouchH.pageX - canvas.offsetLeft;
    platformX.TouchMove(relativeX, TouchH.pageX, TouchShiftX);
};


// рисуем блоки
var blocks = [];
for(c=0; c<blockColumn; c++) {
    blocks[c] = [];
    for(r=0; r<blockRow; r++) {
        blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//рандомно выбираем цвет
function rCol() {
    col = Math.round(255.0*Math.random());
    r = col.toString(16);
    col = Math.round(255.0*Math.random());
    g=col.toString(16);
    col = Math.round(255.0*Math.random());
    b=col.toString(16);
    col="#"+r+g+b;
    return col;
}

//рисуем мяч
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

    var rancol = rCol();

    if(y  >= canvas.height-10 || y  <= ballRadius+5 || x  >= canvas.width -10|| x <= ballRadius+1 ) {
        ctx.fillStyle = rancol;} ;

}
//рисуем платформу
function drawPlatform() {
    ctx.beginPath();
    ctx.rect(platformX, canvas.height-platformHeight, platformWidth, platformHeight);
    ctx.fill();
    ctx.closePath();
}
//создаем новые блоки
function drawBlocks() {
    for(c=0; c<blockColumn; c++) {
        for(r=0; r<blockRow; r++) {
            if(blocks[c][r].status == 1) {
                var blockX = (c*(blockWidth+blockPadding))+blockOffsetLeft;
                var blockY = (r*(blockHeight+blockPadding))+blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//счет
function drawScore() {
    ctx.font = "25px Arial";
    ctx.fillText("Score: "+score, 10, 300);
}

//обнаружение столкновений
function broke() {
    for (c = 0; c < blockColumn; c++) {
        for (r = 0; r < blockRow; r++) {
            var bl = blocks[c][r];
            if (bl.status == 1) {
                if (x > bl.x && x < bl.x + blockWidth && y > bl.y && y < bl.y + blockHeight) {
                    dy = -dy;
                    bl.status = 0;
                    score++;

                    if (score == blockRow * blockColumn) {
                        alert("МОИ ПОЗДРАВЛЕНИЯ! Я ВЕРИЛ В ВАС!!!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}
//отскок от стен и платформы
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    broke();
    drawPlatform();
    drawBlocks();
    drawBall();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > platformX && x < platformX + platformWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                platformX = (canvas.width-platformWidth/2);
            }
        }
    }

    if(rightPressed && platformX < canvas.width-platformWidth) {
        platformX += 7;
    }
    else if(leftPressed && platformX > 0) {
        platformX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();