//игровая логика будет здесь
var game = {
    width: 640,      //равны значениям канваса
    height: 360,
    ctx: undefined,
    platform: undefined,
    ball: undefined,
    rows: 3,
    cols: 9,
    blocks: [],
    sprites: {   //все загружаемые картинки, ключами которых явл их названия
        background: undefined,
        platform: undefined,
        block: undefined,
        ball: undefined,
    },
    running: true,
    score: 0,

    init: function () {             //метод инициализации приложения
        var canvas = document.getElementById("mycanvas"); //получаем элемент canvas
        this.ctx = canvas.getContext("2d"); // получаем контекст, для отрисовки спрайтов
        this.ctx.font = "20px TimesNewRoman"; // создаем размер текста
        this.ctx.fillStyle = "black"; //создаем белый цвет тексту


        window.addEventListener("keydown", function (e) {  //слушаем событие keydown и на его наступлении будем выполнять функцию которая в качестве параметра принимает объект события, уже проверяя которое мы можем понять какая клавиша была нажата. соытие записываем в переменную "е"
            if (e.keyCode == 37) {// его свойства и код даст числовой индефикатор кот соответсвует определенной кнопки. Если кей код = 37 значит нажата клавиша влево
                game.platform.dx = -game.platform.velocity;   // платформе задаем реальную скорость по оси X которая равна ее максимальной допустимой скорости
            } else if (e.keyCode == 39) { // если 39 нажата клавиша вправо
                game.platform.dx = game.platform.velocity;
            } else if (e.keyCode == 32) { // если 32 нажата клавиша пробел
                game.platform.releaseBall(); //запускаем мяч
            }
        });

        window.addEventListener("keyup", function (e) {  //слушаем событие keydown и на его наступлении будем выполнять функцию которая в качестве параметра принимает объект события, уже проверяя которое мы можем понять какая клавиша была нажата. соытие записываем в переменную "е"
            game.platform.stop();
        });


        window.addEventListener("mousemove", function (e) {
            game.platform.x = e.clientX - canvas.offsetLeft;
            if (x > 0 && x < canvas.width) {
                game.platform.x += game.platform,dx;
            }
        });


    },


    load: function(){     // метод загрузки всех изображений в объект спрайтс
        for (var key in this.sprites){  // каждое значение оперции key явл свойствами объекта sprites
            this.sprites[key] = new Image();
            this.sprites[key].src = "img/"+key+".png"; //получаем доступ к каждому объекту спрайтис
        }
    },

    create: function() {             //создаем блоки
        for (var row = 0; row < this.rows; row++) {   //выводим новые блоки в ряду
            for (var col = 0; col < this.cols; col++) { //выводим новые блоки в строке
                var block = { //для каждого блока создаем свои координаты
                    x: 68 * col + 10 , //ширина блока 64 + отступ 4 = 68, каждый сл блок должен иметь ширину больше чем ширина + отступ. 10 отступ от левого края
                    y: 40 * row + 10, //высота блока 32 + отступ 8. 10 отступ от верхнего края
                    width: 64,
                    height: 32,
                    isAlive: true, // при создании блок жив
                };
                this.blocks.push(block);
            }
        }
    },

    start: function () { //запускаем игру в методе старт, в нем происходит инициализация и загрузка изображение и запискается метод run
        this.init(); //инициализация
        this.load(); //загрузка
        this.create(); //создание уровня
        this.run(); // происходит рендеринг (отресовка изображения и указание браузеру чтобы вывели на экран полное изображение
    },
    render: function () { // отвечает за отрисовку и всю логику отрисовки спрайтов
        this.ctx.clearRect(0,0, this.width, this.height); //очищаем место для нового кадра

        this.ctx.drawImage(this.sprites.background,0, 0); //отрисовываем картинку фона
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y); // отрисовываем картинку платформы
        this.ctx.drawImage(this.sprites.ball, this.ball.width * this.ball.frame, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height,); // выпезаем изображение из sprites

        this.blocks.forEach(function (element) { //отрисовываем блоки
            if ( element.isAlive ) { //пока объект жив его нужно отрисовывать
                this.ctx.drawImage(this.sprites.block, element.x, element.y);
            }
        }, this);
        this.ctx.fillText("SCORE: " + this.score,20, this.height - 20); // выводим score, коородинаты текста
    },

    update: function(){       //помещаем всю логику до отрисовки
        if (this.platform.dx){
            this.platform.move(); //движение платформы

        if (this.ball.collide(this.platform)) {//проверяем на столкновение мяча с платформой
            this.ball.bumpPlatform(this.platform); //если сталкивается вызывавем метод bumpplatform
        }

        }
        if( this.ball.dx || this.ball.dy ) { // если есть скорость по X или по Y то считаем что мяч движется
            this.ball.move();
        }
        this.blocks.forEach(function(element, index){ //проверяем столкновения мяча с блоками
            if ( element.isAlive ) { // пока объект жив, проверяем на столкновение
                if( this.ball.collide(element) ) {
                    this.ball.bumpBlock(element); //если да, то отталкиваемся от блока
                }
            }
        }, this);
        this.ball.checkBounds(); // проверка мяча на отталкивание от стен и блоков

    },

    run: function () {
        this.update(); // обновляем информацию
        this.render();//отрисовываем с учетом обновлений


    if (this.running) { //если игра запущена продолжить выполнение анимаци и вып функции run
    window.requestAnimationFrame(function () { //функция внутри себя будет вызывать фрейм, чтобы зациклить рендеринг изображений
        game.run(); // зацикливаем анимацию
    });//выводим нарисованное иображение на экране, этот метод указывает что нужно выполнить перерисовку и вывести изображение в следующем кадре
}
    },

    over: function (message) {
      alert(message);
        this.running = false;
       window.location.reload(); //перезагружаем страницу
    }
};

game.ball = {    //вырезаем из спрайта
    width: 20, //ширина мяча который нужно вывести из sprites
    height: 20, //высота мяча который нужно вывести из sprites
    frame: 0, // координата вырезания sprites по x
    x: 340, //положение мяча по оси X
    y: 280, //положение мяча по оси Y
    dx: 0, //начальная скорость по X
    dy: 0, //начальная скорость по Y
    velocity: 3, // максимальная скорость мяча

    jump: function () {
        this.dy = -this.velocity;
        this.dx = -this.velocity;
        this.animate();
    },
    animate: function() { //анимация мяча
       setInterval(function () { // в качестве первого параметра выполняет функ с заданным интервалом
           ++game.ball.frame; //

           if (game.ball.frame > 3) { // если текущий frame больше 3, обнуляем его тк всего 4 кадра, а 1 кадр начинается с 0
               game.ball.frame = 0;
           }
       }, 100); //вторым параметром выполняем сам интервал, каждые 1с

    },

    move: function(){            //изменение координаты относительно скорости
        this.x += this.dx;
        this.y += this.dy;

    },
    collide: function (element) {  //проверяем столкновение мяча c прерятствиями
        var x = this.x + this.dx; // проверяем координата на следующем кадре анимации
        var y = this.y + this.dy;
        if ( x + this.width > element.x &&   // если правая сторона правее левой стороны блока
            x < element.x + element.width && //если левая сторона левее правой стороны блока
            y + this.height > element.y &&  //если нижняя сторона мяча ниже верхней стороны блока
            y < element.y + element.height) { // если верхняя сторона выше нижнейстороны блока
            return true; //значит столкновение есть
        }
        return false;
    },
    bumpBlock: function (block) {        //отскок. в качестве параметра блок от которого нужно оттолкнуться
        this.dy *= -1;// меняем скорость мяча на противоположную
        block.isAlive = false; // при столкновении блок исчезат.
        ++game.score; //очки
        if ( game.score == game.blocks.length ) { //если счет равен количеству блоков, то игрок выйграл
            game.over('You win!');
        }
    },

    onTheLeftSide: function(platform) { // проверяем что центр мяча левее центра платформы
        return (this.x + this.width / 2) < (platform.x + platform.width / 2); // если центр мяча меншьше центра платформы, значит мяч находится на левой стороне платформы
    },

    bumpPlatform: function(platform) { //при столкновении с платформой скорость мяча должна быть отрицательной
        this.dy = -this.velocity; //отрицательно движется вверх по y
        this.dx = this.onTheLeftSide(platform) ? -this.velocity : this.velocity; // меняем направление отскока мяча в зависимости от кокого края он оттолкнулся. onTheLeftSide скажет на левой ли стороне платформы произошло столкновение
    },

    checkBounds: function () {     //проверяем где текущая координата мяча в данный момент относительного всего canvas
        var x = this.x + this.dx;
        var y = this.y + this.dy;
        if ( x < 0 ) {    //если координата мяча на сл кадре анимации левее левой стороны
            this.x = 0; //чтобы мяч не выходил за рамки поля уст ему 0
            this.dx = this.velocity; // и делаем скорость по мячу положительной (направляем мяч вправо)
        } else if ( x + this.width > game.width) { // если координата x мяча больше ширины экрана
            this.x = game.width - this.width;// если мяч касается правой стороны, тк мяч отрисовывается с левой стороны
            this.dx = -this.velocity;// делаем скорость по X отрицательной, т.е. направляем его вправо
        } else if ( y < 0 ) {  //если координата Y мяча выше верхней стороны экрана
            this.y = 0;//если мяч вылетел вверх
            this.dy = this.velocity;// отталкиваем мяч от аерхней стороны экрана
        } else if ( y + this.height > game.height) {  //если координата нижней стороны мяча больше высоты экрана
            //игрок проигрывает. во всех остальных случаях нужно поменять скорость
            game.over("Game Over") //в случае поражения выдаем сообщение о пройгрыше
        }
    }
};

game.platform = {       //описываем логику работы с платформой
    x: 300,// указываем координаты по которым будем выводить платформу
    y: 300,
    velocity: 5, //скорость платформы. макс допустимая скорость
    dx: 0, //текущая скорость по оси Y
    ball: game.ball, //если мяч на платформе. Явл ссылкой на объект game.ball
    width: 96, //ширина платформы
    height: 16, //высота платформы



    releaseBall: function () { //каждый новый кадр будет отрисовывать новый мяч
        if (this.ball) {
            this.ball.jump();
            this.ball = false;  //после того как мяч взлетел он больше на платформе не находится
        }

    },

    move: function () {
        this.x += this.dx;  //этот метод будет менять координату основываясь на скорости. Присваиваем значение текущей скорости
        if (this.ball) {
            this.ball.x += this.dx; // если мяч на платформе его текущая скорость равна 0
        }
    },

    stop: function () { //обнудение скорости
        this.dx = 0; //текущая скорость равна 0
        if (this.ball) {
            this.ball.dx += this.dx; // если мяч на платформе его текущая скорость равна 0
        }
    },

};



window.addEventListener("load", function () {  //запускаем start при полной загрузки странице в браузере
    game.start();
});
