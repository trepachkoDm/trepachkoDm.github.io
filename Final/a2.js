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
let ballRadius = 10; //радиус мяча
// параметры платформы
let platformHeight = 10; //высота платформы
let platformWidth = 75; //ширина платформы
let platformX = (canvas.width-platformWidth)/2; //центр платформы
let rightPressed = false;
let leftPressed = false;

//параметры блоков
let blockRow = 3; //ряды
let blockColumn = 5; //колонки
let blockWidth = 75; //ширина блока
let blockHeight = 30; //высота блока
let blockPadding = 10; //отступы межу блоками
let blockOffsetTop = 30; // отступ сверху
let blockOffsetLeft = 30; // отступ слева

let TouchShiftX = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//document.addEventListener("touchstart", BallTouchStart, false);
//document.addEventListener("touchmove", BallTouchMove, false);
//document.addEventListener("touchend", BallTouchEnd, false);

//управление (влево/вправо)
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
//управление мышью
function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        platformX = relativeX - platformWidth/2;
    }
}
//управление тачем
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


// создаем блоки
let blocks = [];
for(column = 0; column < blockColumn; column++) {
    blocks[column] = [];
    for(row = 0; row <blockRow; row++) {
        blocks[column][row] = { x: 0, y: 0, status: 1 };
    }
}

//рандомно выбираем цвет
function randomColors() {
    colorss = Math.round(255.0*Math.random());
    redColorss = colorss.toString(16);
    colorss = Math.round(255.0*Math.random());
    greenColorss = colorss.toString(16);
    colorss = Math.round(255.0*Math.random());
    yellowColorss = colorss.toString(16);
    colorss="#"+redColorss+greenColorss+yellowColorss;
    return colorss;
}

//рисуем мяч
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

//рандомно меняем цвет при соприкосновении мяча с платформой
    let colorsRandom= randomColors();
        if(y  >= canvas.height-10) {
            ctx.fillStyle = colorsRandom;
        }
}
//рисуем платформу
function drawPlatform() {
    ctx.beginPath();
    ctx.rect(platformX, canvas.height-platformHeight, platformWidth, platformHeight);
    ctx.fill();
    ctx.closePath();
}
//рисуем блоки
function drawBlocks() {
    for(column = 0; column < blockColumn; column++) {
        for(row = 0; row < blockRow; row++) {
            if(blocks[column][row].status == 1) {
                let blockX = (column*(blockWidth+blockPadding))+blockOffsetLeft;
                let blockY = (row*(blockHeight+blockPadding))+blockOffsetTop;
                blocks[column][row].x = blockX;
                blocks[column][row].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
//выводим счет
function drawScore() {
    ctx.font = "25px Arial";
    ctx.fillText("Score: "+score, 10, 300);
}
function soundClick() {
    var audio = new Audio(); // Создаём новый элемент Audio
    audio.src = "bump.mp3"; // Указываем путь к звуку
    audio.autoplay = true; // Автоматически запускаем
}

//обнаружение столкновений
function broke() {
    for (column = 0; column < blockColumn; column++) {
        for (row = 0; row < blockRow; row++) {
            let bl = blocks[column][row];
            if (bl.status == 1) {
                if (x > bl.x && x < bl.x + blockWidth && y > bl.y && y < bl.y + blockHeight) {
                    dy = -dy;
                    bl.status = 0;
                    window.navigator.vibrate(200);
                    soundClick();
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
//
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    broke();
    drawPlatform();
    drawBlocks();
    drawBall();
//
    x += dx; //движение мяча по X
    y += dy; //движение мяча по Y
//проверка столкновений мяча с границами поля игры
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
//
    if (y + dy < ballRadius) {
        dy = -dy;

    } else if (y + dy > canvas.height - ballRadius) {
        if (x > platformX && x < platformX + platformWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("НУ КАК ТАК, НУ НЕ МОЖЕТ БЫТЬ...");
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
//перемещение платформы
    if(rightPressed && platformX < canvas.width-platformWidth) {
        platformX += 7;
    }
    else if(leftPressed && platformX > 0) {
        platformX -= 7;
    }

    requestAnimationFrame(draw);
}

draw();
