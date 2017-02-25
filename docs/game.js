var myGamePiece;
var canvasWidth = 620;
var canvasHeight = 360;
var myObstacles = [];
var myStars = [];
var myScore;
var myBackground;
var mySound;
// var myMusic;
var myStarSound;


// -----------------
function startGame() {
    var myObstacles = [];
    var myStars = [];
    myGameArea.start();
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myBackground = new component(656, 270, "../static/img/nata.gif", 0, 0, "image");
    myGamePiece = new component(40, 43, "../static/img/nata.gif", 10, 120, "image");
    mySound = new sound("../static/sounds/bang.mp3");
    // myMusic = new sound("../static/sounds/gametheme28.mp3");
    myStarSound = new sound("../static/sounds/star.wav");
    // myMusic.play();
    score = 0;
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.canvas.style.cursor = "none";
        this.context = this.canvas.getContext("2d");
        document.getElementById("canvas").insertBefore(this.canvas, document.getElementById("canvas").childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
        window.addEventListener('touchmove', function (e) {
            myGameArea.x = e.touches[0].screenX;
            myGameArea.y = e.touches[0].screenY;
        })
    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
// ------------------------
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
 
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);}
        else if (type == "image"){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        };

    };
    this.newPos = function () {
        if ((this.x < 0 && this.speedX > 0) ||
            (this.x > canvasWidth && this.speedX < 0) ||
            (this.x >= 0 && this.x <= (canvasWidth - this.width))){
            this.x += this.speedX;
        }
        if ((this.y < 0 && this.speedY > 0) ||
            (this.y > canvasHeight && this.speedY < 0) ||
            (this.y >= 0 && this.y <= (canvasHeight - this.height))){
            this.y += this.speedY;
        }
    };
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    if (myGameArea.touchX && myGameArea.touchY) {
        myGamePiece.x = myGameArea.x;
        myGamePiece.y = myGameArea.y; 
    }
var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            mySound.play();
            myGameArea.stop();
            return;
        }
    }
    for (j = 0; j < myStars.length; j += 1) {
        if (myGamePiece.crashWith(myStars[j])) {
            score += 100;
            myStarSound.play();
            myStars.splice(j,1);
        }
    }
    acselerate = score/1000;
    myGameArea.clear();
    // console.log(everyinterval(Math.floor(150/(1.5 + acselerate))));
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(Math.floor(150/(1 + acselerate)))) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 60;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "cyan", x, 0));
        myObstacles.push(new component(10, x - height - gap, "cyan", x, height + gap));
        if (myObstacles.length > 25) {myObstacles.splice(0,2)};

        k = Math.floor(Math.random()*8)+1;
        y = Math.floor(Math.random()*(canvasHeight - 40) + 10);
        myStars.push(new component(50, 50, "/static/img/" + k + ".gif", x + 50, y, "image"));
        if (myStars.length > 25) {myStars.splice(0,2)};
    }
    for (i = 0; i < myStars.length; i += 1) {
        myStars[i].x += - (1.5 + acselerate);
        myStars[i].update();
    }

    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -(1.5 + acselerate);
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + score;
    myScore.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
        if (myGameArea.keys && (myGameArea.keys[65] || myGameArea.keys[37])) {
            myGamePiece.speedX = -2;
            myGamePiece.image.src = "../static/img/nataback.gif";
        }
        if (myGameArea.keys && (myGameArea.keys[68] || myGameArea.keys[39])) {
            myGamePiece.speedX = 2;
            myGamePiece.image.src = "../static/img/nata.gif";
        }
        if (myGameArea.keys && (myGameArea.keys[87] || myGameArea.keys[38])) {
            myGamePiece.speedY = -2;
        }
        if (myGameArea.keys && (myGameArea.keys[83] || myGameArea.keys[40])) {
            myGamePiece.speedY = 2;
        }
    myGamePiece.newPos();    
    myGamePiece.update();
}

function moveup() {
    myGamePiece.speedY -= 1;
}

function movedown() {
    myGamePiece.speedY += 1;
}

function moveleft() {
    myGamePiece.speedX -= 1;
}

function moveright() {
    myGamePiece.speedX += 1;
}

function stopMove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function restart() {
    location.reload();
}
