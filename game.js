"use strict";

var canvas = document.getElementById('game');
var ctx = canvas.getContext ('2d');

var fps = 60;
var gameloop;
var keys = {};
var gravity = 1


document.addEventListener('load', init());
window.addEventListener('keydown', function(e) {
    keys[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
    keys[e.keyCode];
});

/*
 * functions
 */
function collision(a, b) {
    return (a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.height + a.y > b.y)
    
}

/*
 * classes
 */
function Player() {
    this.x = 0;
    this.y = 0;
    this.width = 8;
    this.height = 8;
    this.color = '#ECF0F1';
    this.score = 0;
    this.speed = 1.5;
    this.friction = 0.2;
    this.velY = 0;
    this.velX = 0;
    this.controls = {
        left: 37,
        right: 39,
        jump: 32
    };

    this.draw = function() {
        ctx.shadowColor = this.shadowColor;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.update = function() {

        // don't dissapear when walking out of the canvas
        // if (this.x <= 0 - this.width) {
        //     this.x = canvas.width;
        // };
        // if (this.x > canvas.width) {
        //     this.x = 0 - this.width
        // };
    }
}

function Coin(_x, _y) {
    this.x = _x || 0;
    this.y = canvas.height - _y || 0;
    this.width = 10;
    this.height = 10;
    this.color = "#2ECC71";

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function Platform(_x, _y, _w, _h, args) {
    this.x = _x || 0;
    this.y = canvas.height - _y || 0;
    this.width = _w || 50;
    this.height = _h || 10;
    this.color = args.color || "#F1C40F";

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function Special(x, y, args) {
    this.x = x || 0;
    this.y = canvas.height - y || 0;
    this.width = args.width || 10;
    this.height = args.height || 10;
    this.color = args.color || "#F1C40F";
    this.type = args.type || null;
    this.targetX = args.targetX || undefined;
    this.targetY = args.targetY || undefined;
    this.velY = args.velY || 0;
    this.velX = args.velX || 0;
    this.playerWidth = args.playerWidth || player.width;
    this.playerHeight = args.playerHeight || player.width;

    this.update = function() {
        if (collision(this, player)) {
            if (this.type == 'teleport') {
                player.x = this.targetX;
                player.y = this.targetY;
                player.velY = this.velY;
                player.velX = this.velX;
            }
            if (this.type == 'resize') {
                player.width = this.playerWidth;
                player.height = this.playerHeight;
            }
        }
    }

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var player = new Player();
player.x = 500;
player.y = canvas.height - 100;

// create coins
var coins = [
    new Coin(520, 300),
    new Coin(610, 300),
    new Coin(520, 390),
    new Coin(610, 390)
];
//create specials
var specials = [
    new Special(460, 260, {
        'type': 'teleport',
        'targetX': 70,
        'targetY': canvas.height - 190,
        'color': '#26A65B',
        'velX': 7
    }),
    new Special(60, 190, {
        'type': 'teleport',
        'targetX': 462,
        'targetY': 250,
        'color': '#26A65B',
        'velY': -3.5
    }),
    new Special(60, 210, {
        'type': 'teleport',
        'targetX': 430,
        'targetY': 250,
        'color': '#DB0A5B',
        'velY': -2,
        'velX': -10
    }),
    new Special(440, 270, {
        'type': 'teleport',
        'targetX': 70,
        'targetY': canvas.height - 210,
        'color': '#DB0A5B',
        'velY': 3.5,
        'velX': 7
    }),
    new Special(200, 350, {
        'type': 'resize',
        'color': 'black',
        'width': 30,
        'height': 30,
        'playerWidth': 3,
        'playerHeight': 3
    })
];

//create platforms
var platforms = [
    new Platform(0, canvas.height, canvas.width, 40, {
        'color': '#F39C12'
    }),
    new Platform(0, canvas.height, 10, canvas.height, {
        'color': '#F39C12'
    }),
    new Platform(canvas.width - 10, canvas.height, 10, canvas.height, {
        'color': '#F39C12'
    }),
    new Platform(0, 10, canvas.width, 10, {
        'color': '#F39C12'
    }),
    new Platform(50, 180, 180, 10, {}),
    new Platform(50, 200, 150, 10, {}),
    new Platform(50, 220, 140, 10, {}),
    new Platform(70, 240, 140, 10, {}),
    new Platform(14, 260, 436, 10, {}),
    new Platform(14, 260, 10, 246, {}),

    new Platform(50, 260, 10, 80, {}),
    new Platform(200, 240, 10, 50, {}),
    new Platform(220, 260, 10, 250, {}),


    new Platform(665, 400, 10, 190, {}),
    new Platform(675, 120, 60, 10, {}),
    new Platform(675, 220, 25, 10, {}),
    new Platform(710, 320, 10, 10, {}),

    new Platform(450, 250, 220, 10, {}),
    new Platform(450, 510, 10, 260, {}),
    new Platform(470, 300, 10, 50, {})

];











function init() {
    console.log('Game started');

    gameloop = setInterval(function() {
        update();
        render();
    }, 1000 / fps)
}

function update() {

    player.velY += 0.028;
    player.y += player.velY;

    for (let i in platforms) {
        if (collision(player, platforms[i])) {
            player.y -= player.velY;
            player.velY = 0;
        }

        player.y++;
        if (keys[player.controls.jump] && collision(player, platforms[i])) {
            player.velY = -2.8;
        };
        player.y--
    }
    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height;
    }








    if (keys[player.controls.left]) {
        player.velX = -player.speed;
    }
    if (keys[player.controls.right]) {
        player.velX = player.speed;
    };
    if (player.velX > -player.friction && player.velX < player.friction) {
        player.velX = 0;
    } else {
        player.velX *= 1 - player.friction
    };


    player.x += player.velX
    for (let i in platforms) {
        if (collision(player, platforms[i])) {
            player.x -= player.velX;
            player.velX -= 0;
        };
    };







    player.update();

    // do stuff when a coin gets picked up
    for (let i in coins) {
        if (collision(player, coins[i])) {
            coins.splice(i, 1);
            player.score += 10;
        }
    }
    for (let i in specials) {
        if (collision(player, specials[i])) {
            specials[i].update();
        }
    }
}

function render() {
    //clear the canvas and make it black
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2C3E50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw all the opjects
    for (let i in coins) {
        coins[i].draw();
    }
    for (let i in platforms) {
        platforms[i].draw();
    }
    for (let i in specials) {
        specials[i].draw()
    }

    player.draw();


    //draw the overlay
    ctx.fillStyle = '#2C3E50';
    ctx.font = "30px Arial";
    ctx.fillText('Score: ' + player.score, 10, 30)
}
