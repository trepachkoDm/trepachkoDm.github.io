var game = {
    running: true,
    ctx: undefined,
    platform: undefined,
    ball: undefined,
    blocks: [],
    score: 0,
    rows: 3,
    cols: 9,
    width: 640,
    height: 360,
    sprites: {
        background: undefined,
        ball: undefined,
        platform: undefined,
        block: undefined
    },

    init() {  //метод инициализации игры
        var canvas = document.getElementById("mycanvas"); //получаем доступ к canvas
        this.ctx = canvas.getContext("2d"); // получаем доступ ко всем свойствам и методам обьекта game
        this.ctx.font = "20px Arial"; // устанавливаем азмер текста
        this.ctx.fillStyle = "white"; // устанавливаем белый цвет тексту


        window.addEventListener("keydown", function (e) {  //вешаем событие keydown которое определяет какая кнопка нажата
            if (e.keyCode == 37) {// 37 - числовой индефикатор который соответсвует кнопки влево
                game.platform.dx = -game.platform.velocity;   // платформе задаем реальную скорость по оси X которая равна ее максимальной допустимой скорости
            } else if (e.keyCode == 39) { // 37 - числовой индефикатор который соответсвует кнопки вправо
                game.platform.dx = game.platform.velocity;
            } else if (e.keyCode == 32) { // 32 - числовой индефикатор который соответсвует кнопки пробел
                game.platform.releaseBall(); //запуск мяча
            }
        });
        window.addEventListener('keyup', function (e) {
            game.platform.stop(); // при отпускании платформа останавливается
        });
    },

    loadImage() {     // метод загрузки всех изображений в объект sprites
        for (var key in this.sprites){  // каждое значение оперции key явл свойствами объекта sprites
            this.sprites[key] = new Image(); //загружаем новую картинку
            this.sprites[key].src = "img/"+key+".png"; //получаем доступ к каждому объекту sprites
        }
    },

    create() { //создаем блоки
        for (var row = 0; row < this.rows; row++) {   //для каждого ряда выводим блок в этом ряду
            for (var col = 0; col < this.cols; col++) {  //для каждой колонки выводим блок в этой колонке
                this.blocks.push({
                    x: 68 * col + 15 , //ширина блока 64 + отступ 4 = 68, каждый сл блок должен иметь ширину больше чем ширина + отступ. 10 отступ от левого края
                    y: 38 * row + 15, //высота блока 32 + отступ 6. 10 отступ от верхнего края
                    width: 64,
                    height: 32,
                    isAlive: true, // при создании объект блока жив
                });
            }
        }
    },

    update() {       //помещаем всю логику до отрисовки
        if ( this.ball.collide(this.platform) ) { //проверяем на столкновение мяча с платформой
            this.ball.bumpPlatform(this.platform); //если сталкивается вызывавем метод bumpplatform
        }

        if( this.ball.dx || this.ball.dy ) { // если есть скорость по X или по Y то считаем что мяч двидется
            this.ball.move();
        }

        if( this.platform.dx ) { //движение платформы
            this.platform.move();
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

    render() { // отвечает за отрисовку и всю логику отрисовки спрайтов
        this.ctx.clearRect(0, 0, this.width, this.height); //очищает выбранную прямоугольную область, указываем координаты x и y и ширину прямоугольника кот необходимо обнулить
        this.ctx.drawImage(this.sprites.background, 0, 0); //отрисовываем картинку по 3 параметрам, сам рисунок и координаты x и y
        this.ctx.drawImage(this.sprites.ball, this.ball.width * this.ball.frame, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height); //ширину мяча * на текущий фрейм который нужно вывести. потом указываем ширину и высоту которая выведется и как нарисовать последние 2 аргумента
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);

        this.blocks.forEach(function(element) {   // использ this тк переданна вторым аргументом в метод fot each
            if ( element.isAlive ) {  //пока объект жив его нужно отрисовывать
                this.ctx.drawImage(this.sprites.block, element.x, element.y);
            }
        }, this);

        this.ctx.fillText('Score: ' + this.score, 15, this.height - 15); // выводим score, коородинаты текста

    },

    run() {
        this.update();
        this.render();

        if (this.running) {
            window.requestAnimationFrame(function(){
                game.run();
            });
        }
    },

    start() {  //запускаем игру в методе старт, в нем происходит инициализация и загрузка изображение и запискается метод run
        this.init(); //инициализация
        this.loadImage(); //загрузка
        this.create(); //создание
        this.run(); // происходит рендеринг (отресовка изображения и указание браузеру чтобы вывели на экран полное изображение
        }
    };

    game.ball = {    //вырезаем мяч из спрайта
        frame: 0,
        x: 340,
        y: 278,
        velocity: 2,
        dx: 0,
        dy: 0,
        width: 22,
        height: 22,
        move(){    //изменение координат относительно скорости
            this.x += this.dx;
            this.y += this.dy;
        },
        animate(){   //анимация мяча
            var self = this;
            this.animation = setInterval(function(){ // в качестве первого параметра выполняет функ с заданным интервалом
                ++self.frame;
                if ( self.frame > 3 ) { // если текущий frame больше 3, обнуляем его тк всего 4 кадра, а 1 кадр начинается с 0
                    self.frame = 0;
                }
            }, 100); //вторым параметром выполняем сам интервал, каждые 1с
        },
        jump: function(){
            this.dy = -this.velocity;
            this.dx = -this.velocity;
            this.animate();
        },
        collide: function (element) {  //метод который проверяет столкновение мяча с параметрами этого метода
            var x = this.x + this.dx; // проверяем координата наложеные в кадре, чтобы не накладывалась
            var y = this.y + this.dy;
            if ( x + this.width > element.x &&   // если правая сторона правее левой стороны блока
                x < element.x + element.width && //если левая сторона левее правой стороны блока
                y + this.height > element.y &&  //если верхняя сторона мяча ниже нижней стороны блока
                y < element.y + element.height) { // если верхняя сторона выше верхней стороны блока
                return true;
            }
            return false;
        },

        bumpBlock(block) {        //отскок. в качестве параметра блок от которого нужно оттолкнуться
            this.dy *= -1;// меняем скорость мяча на противоположную
            block.isAlive = false; // мяч уничтожает блоки. при столкновении объект мертв.
            ++game.score; //очки
            if ( game.score == game.blocks.length ) { //если счет равен количеству блоков, то игрок выйграл
                game.over('You win!');
            }
        },

        onTheLeftSide(platform) { // нам нужно проверить что центр мяча левее центра платформы
            return (this.x + this.width / 2) < (platform.x + platform.width / 2); // если центр мяча меншьше центра платформы, значит мяч находится на левой стороне платформы
        },

        bumpPlatform(platform) { //при столкновении с платформой скорость мяча должна быть отрицательной
            this.dy = -this.velocity; //отрицательно движется вверх по y
            this.dx = this.onTheLeftSide(platform) ? -this.velocity : this.velocity; // меняем направление отскока мяча в зависимости от кокого края он оттолкнулся. onTheLeftSide скажет на левой ли стороне платформы произошло столкновение
        },

        checkBounds() {     //проверяем где текущая координата мяча в данный момент относительного всего canvas
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
            } else if ( y + this.height >= game.height) {  //если координата нижней стороны мяча больше высоты экрана
                //игрок проигрывает. во всех остальных случаях нужно поменять скорость
                game.over("Game Over") //в случае поражения выдаем сообщение о пройгрыше
            }
    },

    over (message) {
        alert(message);
        this.running = false;
        window.location.reload(); //перезагружаем страницу
        }
    };

    game.platform = {       //описываем логику работы с платформой
        x: 300,// указываем координаты по которым будем выводить платформу
        y: 300,
        velocity: 5, //скорость платформы. макс допустимая скорость
        dx: 0, //текущая скорость по оси Y
        ball: game.ball, //если мяч на платформе. Явл ссылкой на объект game.ball
        width: 105,
        height: 25,

    releaseBall: function(){ //каждый новый кадр будет отрисовывать новый мяч
        if (this.ball){
            this.ball.jump();
            this.ball = false;  //после того как мяч взлетел он больше на платформе не находится
        }
    },
        move: function () {
            this.x += this.dx;  //этот метод будет менять координату основываясь на скорости. Присваиваем значение текущей скорости
            if (this.ball){
                this.ball.x += this.dx; // если мяч на платформе его текущая скорость равна 0
            }
        },
        stop: function () { //обнудение скорости
            this.dx = 0; //текущая скорость равна 0
            if (this.ball){
                this.ball.dx += this.dx; // если мяч на платформе его текущая скорость равна 0
            }
        },
    };
window.addEventListener("load", function () {  //запускаем start при полной загрузки странице в браузере
    game.start();
});

