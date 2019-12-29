"use strict";

var clock = document.getElementById("clock");
var wrap = document.getElementById("wrap");
var radiusClock = wrap.offsetWidth / 2;
var sizeNumbers = radiusClock / 6;
var arrowWidth = radiusClock/20;

// для большого круга часов
var clockCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
clockCircle.setAttribute("cx", radiusClock);
clockCircle.setAttribute("cy", radiusClock);
clockCircle.setAttribute("r", radiusClock);
clockCircle.setAttribute("fill", "#fce38a");
clock.appendChild(clockCircle);

var r = radiusClock - sizeNumbers;
var numbersCenterX = radiusClock;
var numbersCenterY = radiusClock;

for (var h = 1; h <= 12; h++) {
    var angle = h / 12 * Math.PI * 2;
    var nx = numbersCenterX + Math.sin(angle) * r;
    var ny = numbersCenterY - Math.cos(angle) * r;


    // для кружка цифр часов
    var numbers = document.createElementNS("http://www.w3.org/2000/svg","circle");
    numbers.setAttribute("cx", nx);
    numbers.setAttribute("cy", ny);
    numbers.setAttribute("r", 20);
    numbers.setAttribute("fill", "#48B382");
    document.querySelector("svg").appendChild(numbers);

    // для цифр часов
    var text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.textContent=h;
    text.setAttribute("x", nx);
    text.setAttribute("y", ny);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("text", 0.5);
    text.style.fontSize = 20;
    clock.appendChild(text);
}

// для стрелок часов
var hourArrow = document.createElementNS("http://www.w3.org/2000/svg","line");
hourArrow.setAttribute("x1", radiusClock);
hourArrow.setAttribute("y1", radiusClock);
hourArrow.setAttribute("x2", radiusClock);
hourArrow.setAttribute("y2", radiusClock/2);
hourArrow.setAttribute("stroke", "black");
hourArrow.setAttribute("stroke-opacity", 0.5);
hourArrow.setAttribute("stroke-width", arrowWidth);
hourArrow.setAttribute("stroke-linecap", "round");
clock.appendChild(hourArrow);

// для стрелок минут
var minuteArrow = document.createElementNS("http://www.w3.org/2000/svg","line");
minuteArrow.setAttribute("stroke", "black");
minuteArrow.setAttribute("stroke-opacity", 0.5);
minuteArrow.setAttribute("stroke-width", arrowWidth/2);
minuteArrow.setAttribute("x1", radiusClock);
minuteArrow.setAttribute("y1", radiusClock);
minuteArrow.setAttribute("x2", radiusClock);
minuteArrow.setAttribute("y2", radiusClock*0.3);
minuteArrow.setAttribute("stroke-linecap", "round");
clock.appendChild(minuteArrow);

// для стрелок секунд
var secondArrow = document.createElementNS("http://www.w3.org/2000/svg","line");
secondArrow.setAttribute("x1", radiusClock);
secondArrow.setAttribute("y1", radiusClock);
secondArrow.setAttribute("x2", radiusClock);
secondArrow.setAttribute("y2", radiusClock*0.1);
secondArrow.setAttribute("stroke", "black");
secondArrow.setAttribute("stroke-opacity", 0.5);
secondArrow.setAttribute("stroke-width", arrowWidth/3);
secondArrow.setAttribute("stroke-linecap", "round");
clock.appendChild(secondArrow);

var currTime = document.createElementNS("http://www.w3.org/2000/svg",'text');
currTime.setAttribute("id",'time');
currTime.setAttribute("stroke","black");
currTime.setAttribute("x",radiusClock);
currTime.setAttribute("y",radiusClock/2 + sizeNumbers);
currTime.setAttribute("text-anchor","middle");
currTime.setAttribute("stroke-opacity", 0.1);
currTime.style.fontSize = 25;
clock.appendChild(currTime);

// определяем точку трансформации стрелок часов, минут, секунд по оси X и Y
hourArrow.style.transformOrigin = "center 200px";
minuteArrow.style.transformOrigin = "center 200px";
secondArrow.style.transformOrigin = "center 200px";

// функция для определения положение электронных часов и стрелок для часов, минут, секунд
function updateArrows () {
    var time = new Date();

    currTime.innerHTML = time.toLocaleTimeString();

    var secondAngular = 6 * time.getSeconds() - 6;
    var minuteAngular = 6 * (time.getMinutes() + (1 / 60) * time.getSeconds());
    var hourAngular = 30 * (time.getHours() + (1 / 60) * time.getMinutes());

    secondAngular += 6;
    secondArrow.style.transform = "rotate(" + secondAngular + "deg)";
    minuteAngular += 6 * (1/60);
    minuteArrow.style.transform = "rotate(" + minuteAngular + "deg)";
    hourAngular += 6 * (1/360);
    hourArrow.style.transform = "rotate(" + hourAngular + "deg)";

    setTimeout(updateArrows, 1020 - time.getMilliseconds()); // планируем обновление стрелок при следующей смене секунды
}
updateArrows();