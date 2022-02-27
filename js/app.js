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
        this.location_Y = [83, 166, 249];
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
        this.x = 200;
        this.y = 400;

        // Set speed for player X: 100, Y: 83
        this.speed_X = 100;
        this.speed_y = 83;
    }

    update(){

    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
