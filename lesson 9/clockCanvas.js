"use strict";

function updateArrows () {

    var wrap = document.getElementById("clock");
    var clock = wrap.getContext("2d");
    var radiusClock = 200;
    var sizeNumbers = radiusClock / 8;
    var clockX = wrap.offsetWidth / 2;
    var clockY = wrap.offsetHeight / 2;
    var arrowWidth = radiusClock / 20;


//оболочка часов
    clock.beginPath(); //начинаем рисование заполненной фигуры
    clock.fillStyle = "#fce38a"; // устанавливаем текущий цвет заполнения
    clock.strokeStyle = "#181818"; // устанавливаем текущий цвет обводки
    clock.arc(clockX, clockY, radiusClock, 0,Math.PI*2, false); //рисуем дугу окружности
    clock.lineWidth = 2;
    clock.stroke(); //обводим текущим цветом обводки всю нарисованную линию
    clock.fill(); //заполняем текущим цветом обводки всю нарисованную линию
    clock.closePath(); //рисуем линию из текущей точки в точку, с которой началось рисование

    var r = radiusClock - sizeNumbers * 1.5; //позиционируем кружки часов относительно циферблата
    var numbersCenterX = radiusClock;
    var numbersCenterY = radiusClock;

    for (var h = 1; h <= 12; h++) {
        var angle = h / 12 * Math.PI * 2;
        var nx = numbersCenterX + Math.sin(angle) * r;
        var ny = numbersCenterY - Math.cos(angle) * r;

        clock.beginPath();
        clock.arc(nx, ny, sizeNumbers, 0, 2 * Math.PI, false);
        clock.fillStyle = "#48B382";
        clock.fill();

        clock.fillStyle = "black";
        clock.font =  "bold 20px";
        clock.textAlign = "center";
        clock.textBaseline = "middle";
        clock.fillText(h,nx, ny); //рисуем на холсте текст с заливкой.
    }

//цифровые часы
    var time = new Date ();
    var currTime = time.toLocaleTimeString();
    clock.beginPath();
    clock.font =  "20px sans-serif";
    clock.textBaseline = "middle";
    clock.fillText(currTime, clockX, clockY - radiusClock/2);
    clock.fill();
    clock.closePath();

// секундная стрелка
    var secondAngular = 6 * time.getSeconds();
    var secondLength = 170;
    clock.beginPath();
    clock.lineCap = "round";
    clock.strokeStyle = "rgba(25, 25, 25, 0.5)";
    clock.moveTo(clockX, clockY); //перемещаем перо в указанную точку без рисования, делает эту точку текущей
    clock.lineTo(clockX + secondLength * Math.sin(secondAngular/180*Math.PI), clockY - secondLength * Math.cos(secondAngular / 180 * Math.PI)); //рисуем линию из текущей точки в указанную, и затем делает эту точку текущей
    clock.lineWidth = arrowWidth/4;
    clock.stroke();
    clock.closePath();

// минутная стрелка
    var minuteAngular = 6 * (time.getMinutes() + (1 / 60) * time.getSeconds());
    var minuteLength = 140;
    clock.beginPath();
    clock.lineCap = "round";
    clock.strokeStyle = "rgba(25, 25, 25, 0.5)";
    clock.moveTo(clockX, clockY);
    clock.lineTo(clockX + minuteLength * Math.sin(minuteAngular/180*Math.PI), clockY - minuteLength * Math.cos(minuteAngular / 180 * Math.PI));
    clock.lineWidth = arrowWidth / 2;
    clock.stroke();
    clock.closePath();

// часовая стрелка
    var hourAngular = 30 * (time.getHours() + (1 / 60) * time.getMinutes());
    var hourLength = 90;
    clock.beginPath();
    clock.lineCap = "round";
    clock.strokeStyle = "rgba(25, 25, 25, 0.5)";
    clock.moveTo(clockX, clockY);
    clock.lineTo(clockX + hourLength * Math.sin(hourAngular/180*Math.PI), clockY - hourLength * Math.cos(hourAngular / 180 * Math.PI));
    clock.lineWidth = arrowWidth;
    clock.stroke();
    clock.closePath();

    setTimeout(updateArrows, 1020 - time.getMilliseconds());
}
updateArrows();