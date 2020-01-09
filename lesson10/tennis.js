"use strict";

    var area = document.getElementById("area");
    var ball = document.getElementById("ball");
    var start = document.getElementById("start");
    var rightRacket = document.getElementById("rightRacket");
    var leftRacket = document.getElementById("leftRacket");

    const areaW = 1000; //ширина игровой арены
    const areaH = 600; //высота игровой арены
    const ballRadius = 25; //радиус шара
    const racketW = 20; //ширина ракеток
    const racketH = 150; //высотка ракеток

    var setting = {
        start: false,
        ballSX: 2, //скорость мяча по X
        ballSY: 2, //скорость мяча по Y
        racketSpeed: 3 //скорость ракеток
    };

    var keys = {
        ArrowUp: false,
        ArrowDown: false,
        Shift: false,
        Control: false
    };

    area.style.width = areaW + "px";
    area.style.height = areaH + "px";

    var ballHash = {
        width: ballRadius * 2,
        height: ballRadius * 2,
        ballX:  areaW / 2 - ballRadius,
        ballY:  areaH / 2 -  ballRadius,
        update: function(){
            ball.style.left = this.ballX + "px";
            ball.style.top = this.ballY +"px";
            ball.style.width =  this.width +"px";
            ball.style.height = this.height + "px";
        }
    };

    var leftRacketHash = {
        width: racketW,
        height: racketH,
        leftRacketX: 0, // растояние ракетки от стены
        leftRacketY: 20, // расстояние рактеки от пола
        update: function (){
            leftRacket.style.left = this.leftRacketX + "px";
            leftRacket.style.bottom = this.leftRacketY + "px";
            leftRacket.style.width = this.width + "px";
            leftRacket.style.height = this.height + "px";
        }
    };

    var rightRacketHash = {
        width: racketW,
        height: racketH,
        rightRacketX: 0,
        rightRacketY: 20,
        update: function(){
            rightRacket.style.right = this.rightRacketX + "px";
            rightRacket.style.bottom = this.rightRacketY + "px";
            rightRacket.style.width = this.width + "px";
            rightRacket.style.height = this.height + "px";
        }
    };

    start.addEventListener("click", startGame);
    document.addEventListener("keydown", startRun);
    document.addEventListener("keyup", stopRun);

    function startGame(){
        ballHash.ballX = areaW / 2 - ballRadius;
        ballHash.ballY =  areaH / 2 -  ballRadius;
        setting.right = rightRacket.offsetTop;
        setting.left = leftRacket.offsetTop;
        setting.start = true;
        requestAnimationFrame(playGame);
    }

    function playGame(){
        if(setting.start){
            ballHash.update();
            if(keys.ArrowUp && setting.right > 0) {
                setting.right -= setting.racketSpeed;
            }
            if(keys.ArrowDown && setting.right < (areaH - rightRacket.offsetHeight)){
                setting.right += setting.racketSpeed;
            }
            if(keys.Shift && setting.left > 0) {
                setting.left -= setting.racketSpeed;
            }
            if(keys.Control && setting.left < (areaH - leftRacket.offsetHeight)){
                setting.left += setting.racketSpeed;
            }
            rightRacket.style.top = setting.right + "px";
            leftRacket.style.top = setting.left + "px";

            ballHash.ballX += setting.ballSX;
        //касания правой стенки
            if(ballHash.ballX + ballHash.width >= areaW){
                ballHash.ballX = areaW -  ballHash.width;
                setting.start = false;
                (function(){
                    let scoreRight = document.getElementById("rightScore");
                    scoreRight.innerHTML = ++scoreRight.innerHTML;
                }());
            }
        //касается правой ракетки
            if(ballHash.ballX + ballHash.width >= areaW - racketW && ball.offsetTop + ballRadius >= rightRacket.offsetTop && ball.offsetTop + ballRadius <= rightRacket.offsetTop + racketH){
                setting.ballSX =-setting.ballSX;
            }
        //касание левой стенки
            if(ballHash.ballX < 0){
                ballHash.ballX = 0;
                setting.start = false;
                (function(){
                    let scoreLeft = document.getElementById("leftScore");
                    scoreLeft.innerHTML = ++scoreLeft.innerHTML;
                }());
            }
        //касается левой ракетки
            if(ballHash.ballX <= racketW && ball.offsetTop + ballRadius >= leftRacket.offsetTop && ball.offsetTop + ballRadius <= leftRacket.offsetTop + racketH){
                setting.ballSX =-setting.ballSX;
            }
        //верхняя и нижняя границы поля
            ballHash.ballY += setting.ballSY;
            if(ballHash.ballY + ballHash.height > areaH){
                setting.ballSY =- setting.ballSY;
                ballHash.ballY = areaH - ballHash.height;
            }
            if(ballHash.ballY < 0){
                setting.ballSY =- setting.ballSY;
                ballHash.ballY = 0;
            }
            requestAnimationFrame(playGame);
        }
    }

    function startRun(event) {
        event.preventDefault();
        keys[event.key] = true;
    }

    function stopRun(event) {
        event.preventDefault();
        keys[event.key] = false;
    }
    leftRacketHash.update();
    rightRacketHash.update();
    ballHash.update();