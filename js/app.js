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
        this.location_Y = [83 - 20, 166 - 20, 249 - 20]; // -20 to avoid bug on canvas border (top and bottom)
        // Randomly set the enemy's starting position from the array above.
        this.x = 0;
        this.y = 0;

        // Set the speed of the enemy. The speed is a random number between 100 and 700.
        this.speed = 0;

        // initialize the enemy's position
        this.reset();

    }
    // TODO: hide() unhide(). // hide and unhide enemy.
    // TODO: changeSprite(). // use different sprite for different enemies.
    // TODO: changeSpeed(). // changes enemy's speed when level is changed and this.sprite"*-mini.png" is used.
    // TODO: switchRow(). // randomly change enemy's row and if another enemy is in the same row, change it's row before colliding with another enemy.

    // Reset enemy's position and speed.
    reset() {
        this.x = this.location_X[Math.floor(Math.random() * this.location_X.length)];
        this.y = this.location_Y[Math.floor(Math.random() * this.location_Y.length)];
        this.resumeSpeed();

    }
    // Pause enemy's movement.
    pauseSpeed() {
        this.speed = 0;
    }
    // Resume enemy's movement.
    resumeSpeed() {
        this.speed = Math.floor(Math.random() * 700) + 100;
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
            this.resumeSpeed();
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
    // TODO: checkWin(). // check if player.y is less than 0.
    // TODO: changeSprite(). // use different sprite for different players.
    // TODO: hide() unhide(). // hide and unhide player.
    // TODO: hide unhide player animation when player resets after collision.

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
        this.resumeSpeed();

    }
    // Pause movement of player
    pauseSpeed() {
        this.playerPaused = true;
        // pause player movement
        this.speed_X = 0;
        this.speed_Y = 0;
    }
    // Resume movement of player
    resumeSpeed() {
        this.playerPaused = false;
        // Set speed for player X: 100, Y: 83
        this.speed_X = 100;
        this.speed_Y = 83;
    }

    update() {
        // Check if player is on water.
        // If so, reset player to default location.
        if (this.y < 0) {
            // TODO: game.pause(); instead of this.pauseSpeed();
            this.pauseSpeed();
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
        // Set default game statuses.
        this.status_start = true;
        this.status_win = false;
        this.status_lose = false;
        this.status_pause = false;

        // Set default values for game score, lives and level.
        this.score = 0;
        this.lives = 3;
        this.MAX_LIVES = 5;
        this.level = 1;
        // Set default no of enemies and MAX_ENEMIES.
        this.no_of_enemies = 2;
        this.MAX_ENEMIES = 5;
        this.currentTopRowWater = true;
        // DONE: add Collectible Heart and Gem.
        // Heart: increase lives by 1. Max lives is 5.
        // Gem: increase score by 1.
        // spawn heart and gem randomly.
        // spawn gem every level. spawn heart rarely.
        this.Heart = {
            sprite: 'images/Heart-mini.png',
            x: Math.floor(Math.random() * 5) * 101,
            y: (Math.floor(Math.random() * 3) + 1) * 83 - 10,
            // if this.level < 10, probability = 0.25 else probability = 0.1
            probability: this.level < 10 ? 0.25 : 0.1,
            info: 'Collect hearts to gain a life. However Max lives is ' + this.MAX_LIVES + '.',
            hide: function () {
                this.x = -200;
                this.y = -200;
            },
            reset: function () {
                this.x = Math.floor(Math.random() * 5) * 101;
                this.y = (Math.floor(Math.random() * 3) + 1) * 83 - 10;
            }
        };
        this.Gem = {
            sprites: ['images/Gem Blue-mini.png', 'images/Gem Green-mini.png', 'images/Gem Orange-mini.png'],
            sprite: 'images/Gem Orange-mini.png',
            x: Math.floor(Math.random() * 5) * 101,
            y: (Math.floor(Math.random() * 3) + 1) * 83 - 30,
            probability: 9.8,
            info: 'Collect gems to gain a score.',
            hide: function () {
                this.x = -200;
                this.y = -200;
            },
            reset: function () {
                this.x = Math.floor(Math.random() * 5) * 101;
                this.y = (Math.floor(Math.random() * 3) + 1) * 83 - 30;
            }
        };
        this.collectibles = [this.Heart, this.Gem];
    }
    // TODO: changeBackground(). // change background sprite for different levels.
    // TODO: changeLevel(). // change level when player reaches top row. render new level.
    // TODO: changeLives(). // change lives when player collides with enemy and collects heart.
    // TODO: changeScore(). // change score when player reaches top row and collect gems.
    // TODO: game.pause(); // pause game when player reaches top row.
    // TODO: game.resume(); // resume game.
    // TODO: game.reset(); // reset game.
    // TODO: animateBackground(). // if level is changed pause game and animate background. animation hint: background moves top to bottom.

    // Game pause.
    // pauses gameUI, player and enemies.
    pause() {
        this.status_pause = true;
        player.pauseSpeed();
        allEnemies.forEach(enemy => {
            enemy.pauseSpeed();
        });
    }

    // Game resume.
    // resumes gameUI, player and enemies.
    resume() {
        this.status_pause = false;
        player.resumeSpeed();
        allEnemies.forEach(enemy => {
            enemy.resumeSpeed();
        });
    }

    // Game reset.
    // resets gameUI, player and enemies.
    reset() {
        this.status_start = true;
        this.status_win = false;
        this.status_lose = false;
        this.status_pause = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.no_of_enemies = 2;
        this.MAX_ENEMIES = 5;
        this.currentTopRowWater = true;
        player.reset();
        allEnemies.forEach(enemy => {
            enemy.reset();
        });
        this.Heart.reset();
        this.Gem.reset();
    }

    getEnemies(noOfEnemies) {
        const enemies = [];
        for (let i = 0; i < noOfEnemies; i++) {
            enemies.push(new Enemy());
        }
        return enemies;
    }

    levelUp() {
        this.level++;
        this.score++;
        this.changeBackground(this.currentTopRowWater); // Implement this. Given a boolean value, change top row to water abd bottom row to grass or vice versa.
        this.collectibles.forEach(item => {
            if (Math.random() < item.probability) {
                item.reset();
            } else {
                item.hide();
            }
        });
    }

    backgroundImages(currentTopRowWater) {
        // hide collectibles
        this.collectibles.forEach(item => {
            item.hide();
        });
        // hide enemies
        allEnemies.forEach(enemy => {
            // enemy.hide();
        });
        // this.pauseGame(); // Implement this.
        const water_sprites = [
                'images/water-block.png',
                'images/water-block-2.png',
                'images/water-block-3.png'
            ],
            grass_sprites = [
                'images/grass-block.png',
                'images/grass-block-2.png',
                'images/grass-block-3.png',
                'images/grass-block-4.png',
                'images/grass-block-5.png',
                'images/grass-block-6.png',
                'images/grass-block-7.png',
                'images/grass-block-8.png'
            ],
            stone_sprites = [
                'images/stone-block.png',
                'images/stone-block-2.png',
                'images/stone-block-3.png',
                'images/stone-block-4.png',
                'images/stone-block-5.png'
            ];
        const WATER = water_sprites[Math.floor(Math.random() * water_sprites.length)],
            GRASS = grass_sprites[Math.floor(Math.random() * grass_sprites.length)],
            STONE = stone_sprites[Math.floor(Math.random() * stone_sprites.length)],
            NO_ROWS = 6,
            NO_COLS = 5;

        let rowImages, row, col;

        if (currentTopRowWater) {
            rowImages = [GRASS, STONE, STONE, STONE, WATER, WATER];
            this.currentTopRowWater = false;
        } else {
            rowImages = [WATER, STONE, STONE, STONE, GRASS, GRASS];
            this.currentTopRowWater = true;
        }

        // for (row = 0; row < NO_ROWS; row++) {
        //     for (col = 0; col< NO_COLS; col++) {
        //         ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
        //     }
        // }

        return rowImages; // this will be used in engine.js function render().

    }

    update() {

    }

    render() {
        ctx.font = '20px sans-serif';
        // fill text with material red color
        ctx.fillStyle = '#b71c1c';
        ctx.fillText('Score: ' + this.score, 10, 25);
        ctx.fillText('Level: ' + this.level, 215, 25);
        ctx.fillText('Lives: ' + this.lives, 420, 25);

        // draw heart according to probability
        ctx.drawImage(Resources.get(this.Heart.sprite), this.Heart.x, this.Heart.y);
        // draw gem
        //this.Gem.sprite = this.Gem.sprites[Math.floor(Math.random() * this.Gem.sprites.length)];
        ctx.drawImage(Resources.get(this.Gem.sprite), this.Gem.x, this.Gem.y);


    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player();
const game = new GameUI();

const allEnemies = game.getEnemies(game.no_of_enemies);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});