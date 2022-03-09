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
        this.prev_x = this.x;
        this.prev_y = this.y;

        // Set the speed of the enemy. The speed is a random number between 100 and 700.
        this.speed = 0;
        this.prev_speed = this.speed;
        this.speedMultiplier = 7;

        // initialize the enemy's position, speed and sprite.
        this.reset();

    }
    // switchRow(). // switch enemy's row.
    // Parameter: enemy_array.
    switchRow(enemy_array) {
        let new_loc = this.location_Y;
        enemy_array.forEach(enemy => {
            // switch row for only first 3 enemies.
            if (enemy.y === this.y && enemy_array.indexOf(enemy) < 4 && enemy.x !== this.x) {
                let i = new_loc.indexOf(this.y);
                new_loc.splice(i, 1);
                this.y = new_loc[Math.floor(Math.random() * new_loc.length)];
            }
        });
    }

    // changeSpeed().
    // changes enemy's speed according to speed multiplier.
    // and if this.sprite contains "mini.png" then change its speed to 1200.
    // Parameter: speed_multiplier.
    changeSpeed(speed_multiplier) {
        this.prev_speed = this.speed;
        // console.log(this.sprite);
        if(this.sprite.includes("mini.png")){
            this.speed = 1200;
        } else if (this.sprite.includes("giant.png")){
            this.speed = 100;
        } else {
            const speed = Math.floor(Math.random() * (100 * speed_multiplier) + 100);
            this.speed = speed > 1000 ? 1000 : speed;
        }
    }

    // hide() unhide(). // hide and unhide enemy.
    hide(){
        // set current enemy's position to previous position.
        this.prev_x = this.x;
        this.prev_y = this.y;
        // hide enemy
        this.x = -101;
        this.y = -101;
        // pause enemy's movement.
        this.pauseSpeed();
    }
    unhide(){
        // unhide enemy
        this.x = this.prev_x;
        this.y = this.prev_y;
        this.resumeSpeed();
    }

    // changeSprite(). // use different sprite for different enemies.
    changeSprite() {
        return enemy_sprites[Math.floor(Math.random() * enemy_sprites.length)];
    }

    // Reset enemy's position and speed.
    reset() {
        this.x = this.location_X[Math.floor(Math.random() * this.location_X.length)];
        this.y = this.location_Y[Math.floor(Math.random() * this.location_Y.length)];
        this.sprite = this.changeSprite();
        this.changeSpeed(this.speedMultiplier);

    }
    // Pause enemy's movement.
    pauseSpeed() {
        // set previous speed to current speed.
        this.prev_speed = this.speed;
        this.speed = 0;
    }
    // Resume enemy's movement.
    resumeSpeed() {
        this.speed = this.prev_speed;
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
            this.reset();
            this.switchRow(allEnemies);
        }

        // ambulance effect for mini enemies.
        if (this.sprite.includes("mini.png")) {
            this.sprite = enemy_mini_sprites[Math.floor(Math.random() * enemy_mini_sprites.length)];
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
        this.paused = false;

        // reset player
        this.reset();
    }
    // TODO: checkWin(). // check if player.y is less than 0.
    // TODO: changeSprite(). // use different sprite for different players.
    // TODO: hide() unhide(). // hide and unhide player.
    // TODO: hide unhide player animation when player resets after collision.

    // Check if player collides with enemy. If so, return true.
    enemyCollisions(enemy) {
        return (this.x < enemy.x + 70 &&
            this.x + 70 > enemy.x &&
            this.y < enemy.y + 50 &&
            50 + this.y > enemy.y);
    }
    // Check if player collides with collectibles
    collectibleCollisions(item) {
        return (this.x < item.x + 70 &&
            this.x + 70 > item.x &&
            this.y < item.y + 50 &&
            50 + this.y > item.y);
    }

    // Resets Player
    reset() {
        this.x = 200;
        this.y = 400;
        this.resumeSpeed();

    }
    // Pause movement of player
    pauseSpeed() {
        this.paused = true;
        // pause player movement
        this.speed_X = 0;
        this.speed_Y = 0;
    }
    // Resume movement of player
    resumeSpeed() {
        this.paused = false;
        // Set speed for player X: 100, Y: 83
        this.speed_X = 100;
        this.speed_Y = 83;
    }

    update() {
        // Check if player is on water.
        // If so, reset player to default location.
        if (this.y < 0) {
            game.pause();
            game.levelUp();
            // TODO: game.resume(), change background image.
        }
        allEnemies.forEach(enemy => {
            if (this.enemyCollisions(enemy)) {
                this.reset();
                game.lives--; // decrease a life
                if (game.lives === 0) {
                    game.reset(); // resets game if 0 lives left
                }
            }
        });
        game.collectibles.forEach(item => {
            if (this.collectibleCollisions(item)){
                item.hide();
                game.score += item.name==='Gem' ? 1 : 0;
                game.lives += item.name==='Heart' ? 1 : 0;
                game.lives = game.lives > game.MAX_LIVES ? game.MAX_LIVES : game.lives;
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
            name: 'Heart',
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
            name: 'Gem',
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
        this.rowImages = [
            'images/water-block.png', // Top row is water
            'images/stone-block.png', // Row 1 of 3 of stone
            'images/stone-block.png', // Row 2 of 3 of stone
            'images/stone-block.png', // Row 3 of 3 of stone
            'images/grass-block.png', // Row 1 of 2 of grass
            'images/grass-block.png' // Row 2 of 2 of grass
        ];
        // previouse row images.
        this.prevRowImages = this.rowImages;
    }
    // DONE: changeBackground(). // change background sprite for different levels.
    // NOT NEEDED: animateBackground(). // if level is changed pause game and animate background. animation hint: background moves top to bottom.
    // TODO: changeLives(). // change lives when player collides with enemy and collects heart.
    // TODO: changeScore(). // change score when player reaches top row and collect gems.
    // DONE: game.pause(); // pause game when player reaches top row.
    // DONE: game.resume(); // resume game.
    // TODO: game.reset(); // reset game.

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
        this.pause();
        this.status_start = true;
        this.status_win = false;
        this.status_lose = false;
        //this.status_pause = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.no_of_enemies = 2;
        this.MAX_ENEMIES = 5;
        this.currentTopRowWater = true;
        // player.hide(); // Implement This
        allEnemies = this.getEnemies(this.no_of_enemies);
        allEnemies.forEach(enemy => {
            // enemy.hide(); // Implement This
        });
        this.collectibles.forEach(item => {
            item.hide();
        });

        this.changeBackground(this.currentTopRowWater);
        player.reset();
        player.pauseSpeed();
        allEnemies.forEach(enemy => {
            enemy.reset();
            enemy.pauseSpeed();
        });
        this.collectibles.forEach(item => {
            if (Math.random() < item.probability) {
                item.reset();
            } else {
                item.hide();
            }
        });
        this.resume();
    }

    getEnemies(noOfEnemies) {
        const enemies = [];
        for (let i = 0; i < noOfEnemies; i++) {
            enemies.push(new Enemy());
        }
        return enemies;
    }

    levelUp() {
        // Pause game if not paused.
        if (!this.status_pause) {
            this.pause();
        }
        // change win_status to true.
        this.status_win = true;
        // Increase level and score by 1.
        this.level++;
        this.score++;
        // Increase no of enemies by 1 till MAX_ENEMIES every 10 levels.
        if (this.level % 10 === 0 && this.no_of_enemies < this.MAX_ENEMIES) {
            this.no_of_enemies++;
            // TODO: allEnemies = getEnemies(no_of_enemies);
        }

        // change background Images.
        this.changeBackground(this.currentTopRowWater);
        // this.changeBackground(this.currentTopRowWater); // Implement this. Given a boolean value, change top row to water abd bottom row to grass or vice versa.
        // spawn collectibles and enemies after background change and resume game.
        setTimeout(() => {
            allEnemies.forEach(enemy => {
                enemy.reset();
                enemy.pauseSpeed();
            });
            this.collectibles.forEach(item => {
                if (Math.random() < item.probability) {
                    item.reset();
                } else {
                    item.hide();
                }
            });
            game.resume();
        }, 2150);
    }

    changeBackground(currentTopRowWater) {
        // pause game if not paused.
        if (!this.status_pause) {
            this.pause();
        }
        const WATER = water_sprites[Math.floor(Math.random() * water_sprites.length)],
            GRASS = grass_sprites[Math.floor(Math.random() * grass_sprites.length)],
            STONE = stone_sprites[Math.floor(Math.random() * stone_sprites.length)];

        let rowImages1, rowImages2, rowImages3, rowImages4, rowImages5;

        rowImages1 = [this.prevRowImages[0], this.prevRowImages[0], this.prevRowImages[1], this.prevRowImages[2], this.prevRowImages[3], this.prevRowImages[4]];
        rowImages2 = [STONE, this.prevRowImages[0], this.prevRowImages[0], this.prevRowImages[1], this.prevRowImages[2], this.prevRowImages[3]];
        rowImages3 = [STONE, STONE, this.prevRowImages[0], this.prevRowImages[0], this.prevRowImages[1], this.prevRowImages[2]];
        rowImages4 = [STONE, STONE, STONE, this.prevRowImages[0], this.prevRowImages[0], this.prevRowImages[1]];

        if (currentTopRowWater) {
            rowImages5 = [GRASS, STONE, STONE, STONE, this.prevRowImages[0], this.prevRowImages[0]];
        } else {
            rowImages5 = [WATER, STONE, STONE, STONE, this.prevRowImages[0], this.prevRowImages[0]];
        }
        this.prevRowImages = rowImages5;
        this.currentTopRowWater = !this.currentTopRowWater;

        const speed_Y = player.paused ? 83 : player.speed_Y;

        setTimeout(() => {
            this.rowImages = rowImages1;
            // move player down according to player's speed.
            player.y += speed_Y;
            allEnemies.forEach(enemy => {
                enemy.y += speed_Y;
                enemy.x = enemy.y > 400 ? -101 : enemy.x;
            });
            this.collectibles.forEach(item => {
                item.y += speed_Y;
                if (item.y > 410) {
                    item.hide();
                }
            });
        }, 0);
        setTimeout(() => {
            this.rowImages = rowImages2;
            player.y += speed_Y;
            allEnemies.forEach(enemy => {
                enemy.y += speed_Y;
                enemy.x = enemy.y > 400 ? -101 : enemy.x;
            });
            this.collectibles.forEach(item => {
                item.y += speed_Y;
                if (item.y > 410) {
                    item.hide();
                }
            });
        }, 500);
        setTimeout(() => {
            this.rowImages = rowImages3;
            player.y += speed_Y;
            allEnemies.forEach(enemy => {
                enemy.y += speed_Y;
                enemy.x = enemy.y > 400 ? -101 : enemy.x;
            });
            this.collectibles.forEach(item => {
                item.y += speed_Y;
                if (item.y > 410) {
                    item.hide();
                }
            });
        }, 1000);
        setTimeout(() => {
            this.rowImages = rowImages4;
            player.y += speed_Y;
            allEnemies.forEach(enemy => {
                enemy.y += speed_Y;
                enemy.x = enemy.y > 400 ? -101 : enemy.x;
            });
            this.collectibles.forEach(item => {
                item.y += speed_Y;
                if (item.y > 410) {
                    item.hide();
                }
            });
        }, 1500);
        setTimeout(() => {
            this.rowImages = rowImages5;
            player.y += speed_Y;
            allEnemies.forEach(enemy => {
                enemy.y += speed_Y;
                enemy.x = enemy.y > 400 ? -101 : enemy.x;
            });
            this.collectibles.forEach(item => {
                item.y += speed_Y;
                if (item.y > 410) {
                    item.hide();
                }
            });
        }, 2000);

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

// Constants for background images, collectibles, enemies, and player.
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
        'images/stone-block-4.png',
    ],
    enemy_sprites = [
        'images/enemy-bug.png',
        'images/enemy-bug-2.png',
        'images/enemy-bug-3.png',
        'images/enemy-bug-4.png',
        'images/enemy-bug-5.png',
        'images/enemy-bug-6.png',
        'images/enemy-bug-7.png',
        'images/enemy-bug-8.png',
        'images/enemy-bug-9.png',
        'images/enemy-bug-10.png',
        'images/enemy-bug-11.png',
        'images/enemy-bug mini.png',
        'images/enemy-bug giant.png',
    ],
    enemy_mini_sprites = [
        'images/enemy-bug mini.png',
        'images/enemy-bug-2 mini.png',
        'images/enemy-bug-3 mini.png',
        'images/enemy-bug-4 mini.png',
        'images/enemy-bug-5 mini.png',
        'images/enemy-bug-6 mini.png',
        'images/enemy-bug-7 mini.png',
        'images/enemy-bug-9 mini.png',
        'images/enemy-bug-10 mini.png',
        'images/enemy-bug-11 mini.png',
    ],
    player_sprites = [
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
    ];


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const player = new Player();
const game = new GameUI();

let allEnemies = game.getEnemies(game.no_of_enemies);

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