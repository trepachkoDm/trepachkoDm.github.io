// canvas
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
//находим центр
let x = canvas.width/2;
let y = canvas.height-30;
//счет
let score = 0;
let lives = 1;

//параметры мяча
let speed = 1;
let dx = speed;
let dy = -speed;
let ballRadius = 10;
// параметры платформы
let platformHeight = 10;
let platformWidth = 75;
let platformX = (canvas.width-platformWidth)/2;
let rightPressed = false;
let leftPressed = false;

//параметры блоков
let blockRow = 3;
let blockColumn = 5;
let blockWidth = 75;
let blockHeight = 20;
let blockPadding = 10;
let blockOffsetTop = 30;
let blockOffsetLeft = 30;

let TouchShiftX = 0;

//управление
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//document.addEventListener("touchstart", BallTouchStart, false);
//document.addEventListener("touchmove", BallTouchMove, false);
//document.addEventListener("touchend", BallTouchEnd, false);


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
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        platformX = relativeX - platformWidth/2;
    }
}

// BallTouchStart = function (e) {
//  e.preventDefault();

// var TouchH = e.targetTouches[0];
//  TouchShiftX = platformX.TouchStart(TouchH.pageX);
//};

// BallTouchEnd = function (e) {
// e.preventDefault();
//};

// BallTouchMove = function (e) {
//  e.preventDefault();
//   let TouchH = e.targetTouches[0];
//  let relativeX = TouchH.pageX - canvas.offsetLeft;
// platformX.TouchMove(relativeX, TouchH.pageX, TouchShiftX);
//};


// рисуем блоки
let blocks = [];
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

    let rancol = rCol();

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
                let blockX = (c*(blockWidth+blockPadding))+blockOffsetLeft;
                let blockY = (r*(blockHeight+blockPadding))+blockOffsetTop;
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
            let bl = blocks[c][r];
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
        canvas.navigator.vibrate(10);
    }
    if (y + dy < ballRadius) {
        dy = -dy;
        canvas.navigator.vibrate(10);
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > platformX && x < platformX + platformWidth) {
            dy = -dy;
            canvas.navigator.vibrate(10);
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
