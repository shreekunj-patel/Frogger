// Enemies our player must avoid
class Enemy {
    constructor() {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';

        // Off screen locations of X(column) and Y(row) for randomly spawning enemies from given array.
        // values are implemented from engine.js (line: 137)
        this.location_X = [-101, -202, -303, -404];
        this.location_Y = [83-20, 166-20, 249-20]; // -20 to avoid bug on canvas border (top and bottom)
        // Randomly set the enemy's starting position from the array above.
        this.x = this.location_X[Math.floor(Math.random() * this.location_X.length)];
        this.y = this.location_Y[Math.floor(Math.random() * this.location_Y.length)];

        // Set the speed of the enemy. The speed is a random number between 100 and 700.
        this.speed = Math.floor(Math.random() * (700 - 100 + 1)) + 100;

    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x = this.speed * dt + this.x;

        // If the enemy is off screen, set its position randomly from location_X and location_Y arrays.
        // and also update it's speed randomly. Basically, reset the enemy.
        if (this.x > 505) {
            this.x = this.location_X[Math.floor(Math.random() * this.location_X.length)];
            this.y = this.location_Y[Math.floor(Math.random() * this.location_Y.length)];
            this.speed = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
        }

    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        // The image/sprite for our player.
        this.sprite = 'images/char-boy.png';

        // set default location of player X: 200, Y: 400
        this.x = 0;
        this.y = 0;
        // Set speed for player X: 100, Y: 83
        this.speed_X = 0;
        this.speed_Y = 0;
        this.playerPaused = false;

        // reset player
        this.reset();
    }
    // Check if player collides with enemy. If so, return true.
    checkCollisions(enemy) {
        return (this.x < enemy.x + 70 &&
            this.x + 70 > enemy.x &&
            this.y < enemy.y + 50 &&
            50 + this.y > enemy.y);
    }
    // Resets Player
    reset() {
        this.x = 200;
        this.y = 400;
        this.resumeMovement();

    }
    // Pause movement of player
    pauseMovement() {
        this.playerPaused = true;
        // pause player movement
        this.speed_X = 0;
        this.speed_Y = 0;
    }
    // Resume movement of player
    resumeMovement() {
        this.playerPaused = false;
        // Set speed for player X: 100, Y: 83
        this.speed_X = 100;
        this.speed_Y = 83;
    }

    update(){
        // Check if player is on water.
        // If so, reset player to default location.
        if (this.y < 0) {
            // TODO: game.pause(); instead of this.pauseMovement();
            this.pauseMovement();
        }
        allEnemies.forEach(enemy => {
            if (this.checkCollisions(enemy)) {
                this.reset();
            }
        });

    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        game.render();
    }

    // Handle input from the user.
    handleInput(key) {
        if (key === 'left' && this.x > 0) {
            this.x -= this.speed_X;
        }
        if (key === 'right' && this.x < 400) {
            this.x += this.speed_X;
        }
        if (key === 'up' && this.y > 0) {
            this.y -= this.speed_Y;
        }
        if (key === 'down' && this.y < 400) {
            this.y += this.speed_Y;
        }
    }
}

// GameUI class
// this class is responsible for game score, lives and level.
class GameUI {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
    }

    update() {

    }

    render() {
        ctx.font = '20px sans-serif';
        // fill text with material red color
        ctx.fillStyle = '#b71c1c';
        ctx.fillText('Score: ' + this.score, 10, 20);
        ctx.fillText('Level: ' + this.level, 215, 20);
        ctx.fillText('Lives: ' + this.lives, 420, 20);
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player();

const MAX_NO_OF_ENEMIES = 5;
function getEnemies() {
    const enemies = [];
    for (let i = 0; i < MAX_NO_OF_ENEMIES; i++) {
        enemies.push(new Enemy());
    }
    return enemies;
}

const allEnemies = getEnemies();
game = new GameUI();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
