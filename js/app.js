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
        // 20px up from bottom of row.
        this.location_Y = [tileHeight() - Math.round(tileHeight() * 0.2410), (tileHeight() * 2) - Math.round(tileHeight() * 0.2410), (tileHeight() * 3) - Math.round(tileHeight() * 0.2410)];
        // Randomly set the enemy's starting position from the array above.
        this.x = 0;
        this.y = 0;
        this.prev_x = this.x;
        this.prev_y = this.y;

        // Set the speed of the enemy. The speed is a random number between 100 and 700.
        this.speed = 0;
        this.prev_speed = this.speed;
        this.speedMultiplier = game.level * 0.25;
        this.speedMultiplier = this.speedMultiplier < 1 ? 1 : this.speedMultiplier;

        // initialize the enemy's position, speed and sprite.
        this.reset();

    }
    // switchRow(). // switch enemy's row.
    // Parameter: enemy_array.
    switchRow(enemy_array) {
        let new_loc = this.location_Y;
        enemy_array.forEach((enemy,index) => {
            // switch row for only first 3 enemies.
            if (enemy.y === this.y && index < 4 && enemy.x !== this.x) {
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
        if (this.sprite.includes("mini.png")) {
            this.speed = 1200;
        } else if (this.sprite.includes("giant.png")) {
            this.speed = 100;
        } else {
            const speed = Math.floor(Math.random() * (100 * speed_multiplier) + 100);
            this.speed = speed > 1000 ? 1000 : speed;
        }
    }

    // hide() unhide(). // hide and unhide enemy.
    hide() {
        // set current enemy's position to previous position.
        this.prev_x = this.x;
        this.prev_y = this.y;
        // hide enemy
        this.x = -101;
        this.y = -101;
        // pause enemy's movement.
        this.pauseSpeed();
    }
    unhide() {
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
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, imageWidth(), imageHeight());
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
    // isPaused(). // check if player is paused.
    isPaused() {
        return this.paused;
    }
    // get player's current row and column.
    getRow() {
        return Math.round(this.y / tileHeight());
    }
    getCol() {
        return Math.round(this.x / tileWidth());
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
        // set player's x to 2nd tile.
        this.x = tileWidth() * 2;
        // set player's y to 5th tile.
        this.y = (tileHeight() * 5) - Math.round(tileHeight() * 0.15);
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
        this.speed_X = Math.round(tileWidth() * 0.9901);
        this.speed_Y = tileHeight();
    }

    update() {
        game.update();
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
                if (game.lives <= 0) {
                    game.modal.type = 'game-over'; // resets game if 0 lives left
                    game.modal.show();
                }
            }
        });
        game.collectibles.forEach(item => {
            if (this.collectibleCollisions(item)) {
                item.hide();
                game.score += item.name === 'Gem' ? 1 : 0;
                game.lives += item.name === 'Heart' ? 1 : 0;
                game.lives = game.lives > game.MAX_LIVES ? game.MAX_LIVES : game.lives;
            }
        });

    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, imageWidth(), imageHeight());
        game.render();
    }

    // Handle input from the user.
    handleInput(key) {
        if (key === 'left') {
            if (game.modal.isHidden && !this.isPaused()) {
                if (this.x > 0) {
                this.x -= this.speed_X;
                }
            } else {
                game.modal.prevSprite();
            }
        }
        if (key === 'right') {
            if (game.modal.isHidden && !this.isPaused()) {
                if (this.x < tileWidth() * 4) {
                this.x += this.speed_X;
                }
            } else {
                game.modal.nextSprite();
            }
        }
        if (key === 'up') {
            if (game.modal.isHidden && !this.isPaused()) {
                if (this.y > 0) {
                this.y -= this.speed_Y;
                }
            } else {
                game.modal.prevSprite();
            }
        }
        if (key === 'down') {
            if (game.modal.isHidden && !this.isPaused()) {
                if (this.y < (tileHeight() * 5) - Math.round(tileHeight() * 0.15)) {
                this.y += this.speed_Y;
                }
            } else {
                game.modal.nextSprite();
            }
        }
        if (key === 'pause') {
            if(game.modal.isHidden){
                game.pause();
                game.modal.type = 'pause';
                game.modal.show();
            } else if (game.modal.type === 'game-over') {
                game.modal.restart();
            } else {
                game.modal.resume();
            }
        }
        if (key === 'restart') {
            game.modal.type = 'restart';
            game.modal.show();
        }
    }
}

// GameUI class
// this class is responsible for game score, lives and level.
class GameUI {
    constructor() {
        // Set default values for game score, lives and level.
        this.score = 0;
        this.lives = 3;
        this.MAX_LIVES = 5;
        this.level = 1;
        // Set default no of enemies and MAX_ENEMIES.
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
            x: Math.floor(Math.random() * 5) * tileWidth(),
            y: (Math.floor(Math.random() * 3) + 1) * tileHeight() - Math.round(tileHeight() * 0.1205),
            // if this.level < 10, probability = 0.25 else probability = 0.1
            probability: this.level < 15 ? 0.25 : 0.15,
            info: 'Collect hearts to gain a life. However Max lives is ' + this.MAX_LIVES + '.',
            hide: function () {
                this.x = -200;
                this.y = -200;
            },
            reset: function () {
                this.x = Math.floor(Math.random() * 5) * tileWidth();
                this.y = (Math.floor(Math.random() * 3) + 1) * tileHeight() - Math.round(tileHeight() * 0.1205);
            },
            getRow: function () {
                return Math.round(this.y / tileHeight());
            },
            getCol: function () {
                return Math.round(this.x / tileWidth());
            }
        };
        this.Gem = {
            name: 'Gem',
            sprites: ['images/Gem Blue-mini.png', 'images/Gem Green-mini.png', 'images/Gem Orange-mini.png'],
            sprite: 'images/Gem Orange-mini.png',
            x: Math.floor(Math.random() * 5) * tileWidth(),
            y: (Math.floor(Math.random() * 3) + 1) * tileHeight() - Math.round(tileHeight() * 0.3614),
            probability: 9.8,
            info: 'Collect gems to gain a score.',
            hide: function () {
                this.x = -200;
                this.y = -200;
            },
            reset: function () {
                this.x = Math.floor(Math.random() * 5) * tileWidth();
                this.y = (Math.floor(Math.random() * 3) + 1) * tileHeight() - Math.round(tileHeight() * 0.3614);
            },
            getRow: function () {
                return Math.round(this.y / tileHeight());
            },
            getCol: function () {
                return Math.round(this.x / tileWidth());
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
        // previous row images.
        this.prevRowImages = this.rowImages;
        // animating
        this.animating = false;
        // initialize modal
        this.modal = new Modal('welcome', player.sprite, this.rowImages);
    }
    // isAnimating()
    isAnimating() {
        return this.animating;
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
        player.pauseSpeed();
        allEnemies.forEach(enemy => {
            enemy.pauseSpeed();
        });
    }

    // Game resume.
    // resumes gameUI, player and enemies.
    resume() {
        player.resumeSpeed();
        allEnemies.forEach(enemy => {
            enemy.resumeSpeed();
        });
    }

    // Game reset.
    // resets gameUI, player and enemies.
    reset() {
        this.pause();
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.MAX_ENEMIES = 5;
        this.currentTopRowWater = true;
        // player.hide(); // Implement This
        allEnemies = this.getEnemies(this.currentEnemies());
        allEnemies.forEach(enemy => {
            // enemy.hide(); // Implement This
        });
        this.collectibles.forEach(item => {
            item.hide();
        });

        // this.changeBackground(this.currentTopRowWater);
        this.rowImages = [
            'images/water-block.png', // Top row is water
            'images/stone-block.png', // Row 1 of 3 of stone
            'images/stone-block.png', // Row 2 of 3 of stone
            'images/stone-block.png', // Row 3 of 3 of stone
            'images/grass-block.png', // Row 1 of 2 of grass
            'images/grass-block.png' // Row 2 of 2 of grass
        ];
        this.prevRowImages = this.rowImages;
        this.animating = false;
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

    currentEnemies() {
        let numOfEnemies = this.level - 1;
        if (this.level <= 3) {
            numOfEnemies = 1;
        } else if (this.level <= 6) {
            numOfEnemies = 2;
        } else if (this.level <= 10) {
            numOfEnemies = 3;
        } else if (this.level <= 15) {
            numOfEnemies = 4;
        } else {
            numOfEnemies = this.MAX_ENEMIES;
        }
        return numOfEnemies;
    }

    getEnemies(numOfEnemies) {
        const enemies = [];
        for (let i = 0; i < numOfEnemies; i++) {
            enemies.push(new Enemy());
        }
        return enemies;
    }

    levelUp() {
        // Pause game if not paused.
        if (!player.isPaused()) {
            this.pause();
        }
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
            allEnemies = this.getEnemies(this.currentEnemies());
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
            this.animating = false;
            this.resume();
        }, 2150);
    }

    moveWithBG(moveSpeed_Y) {
        player.y += moveSpeed_Y;
        allEnemies.forEach(enemy => {
            enemy.y += moveSpeed_Y;
            if (enemy.y > ((tileHeight() * 5) - Math.round(tileHeight() * 0.1807))) {
                enemy.x = -101;
            } else {
                enemy.x = enemy.x;
            }
        });
        this.collectibles.forEach(item => {
            item.y += moveSpeed_Y;
            if (item.y > (tileHeight() * 5) - Math.round(tileHeight() * 0.0602)) {
                item.hide();
            }
        });
    }

    changeBackground(currentTopRowWater) {
        // pause game if not paused.
        if (!player.isPaused()) {
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

        const speed_Y = tileHeight();

        setTimeout(() => {
            this.animating = true;
            if (!player.isPaused()){
                player.pauseSpeed();
            }
            this.rowImages = rowImages1;
            // move player down according to player's speed.
            this.moveWithBG(speed_Y);
        }, 0);
        setTimeout(() => {
            if (!player.isPaused()){
                player.pauseSpeed();
            }
            this.rowImages = rowImages2;
            this.moveWithBG(speed_Y);
        }, 500);
        setTimeout(() => {
            if (!player.isPaused()){
                player.pauseSpeed();
            }
            this.rowImages = rowImages3;
            this.moveWithBG(speed_Y);
        }, 1000);
        setTimeout(() => {
            if (!player.isPaused()){
                player.pauseSpeed();
            }
            this.rowImages = rowImages4;
            this.moveWithBG(speed_Y);
        }, 1500);
        setTimeout(() => {
            if (!player.isPaused()){
                player.pauseSpeed();
            }
            this.rowImages = rowImages5;
            this.moveWithBG(speed_Y);
        }, 2000);

    }

    update() {
        // update player
        player.x = tileWidth() * player.getCol();
        player.y = (tileHeight() * player.getRow()) - Math.round(tileHeight() * 0.15);
        if (!player.paused) {
            player.speed_X = Math.round(tileWidth() * 0.9901);
            player.speed_Y = tileHeight();
        }
        // update enemies
        if (!this.isAnimating()) {
            allEnemies.forEach(enemy => {
                let index = enemy.location_Y.indexOf(enemy.y);
                enemy.location_Y = [tileHeight() - Math.round(tileHeight() * 0.2410), (tileHeight() * 2) - Math.round(tileHeight() * 0.2410), (tileHeight() * 3) - Math.round(tileHeight() * 0.2410)];
                enemy.y = enemy.location_Y[index];
            });
        }
        // update collectibles
        this.collectibles.forEach(item => {
            if (item.x > 0 && item.y > 0) {
                item.x = tileWidth() * item.getCol();
                if (item.name === 'Gem') {
                    item.y = (tileHeight() * item.getRow()) - Math.round(tileHeight() * 0.3614);
                } else {
                    item.y = (tileHeight() * item.getRow()) - Math.round(tileHeight() * 0.1205);
                }
            }
        });
     }

    render() {
        ctx.font = '20px sans-serif';
        // fill text with material red color
        ctx.fillStyle = '#b71c1c';
        ctx.fillText('Score: ' + this.score, Math.round(canvasWidth() * 0.01980), 25);
        ctx.fillText('Level: ' + this.level, Math.round(canvasWidth() * 0.42574), 25);
        ctx.fillText('Lives: ' + this.lives, Math.round(canvasWidth() * 0.83168), 25);

        // draw heart according to probability
        ctx.drawImage(Resources.get(this.Heart.sprite), this.Heart.x, this.Heart.y, imageWidth(), imageHeight());
        // draw gem
        //this.Gem.sprite = this.Gem.sprites[Math.floor(Math.random() * this.Gem.sprites.length)];
        ctx.drawImage(Resources.get(this.Gem.sprite), this.Gem.x, this.Gem.y, imageWidth(), imageHeight());


    }
}

// game modal
class Modal {
    constructor(type, sprite=null, rowImages=null) {
        this.type = type;
        this.sprite = sprite ? sprite : player_sprites[0];
        this.rowImages = rowImages ? rowImages : grass_sprites;
        this.tips = [
            "Want to move Diagonally? Try using <code>UP</code>(<code>W</code>) and <code>RIGHT</code>(<code>D</code>) keys at the same time.",
            "Need a quick break? Just hit the <code>SPACEBAR</code> or <code>Esc</code> to pause the game.",
            "Quickly change character with <code>arrow keys</code> while paused.",
            "Collect the heart to gain a life.",
            "You can have a maximum of 5 lives.",
            "Make sure you don't hit the bugs, it will cost you a life.",
            "If you run out of lives, the game is over.",
            "Collect the Gem to increase your score.",
            "You can click on this message to see next tip.",
        ];
        this.controls = `
            <table>
                <h3> Game Controls</h3>
                <tr>
                    <th>Action</th>
                    <th>Key</th>
                    <th>Optional Key</th>
                </tr>
                <tr>
                    <td class="action"><code>Move Left</code></td>
                    <td class="key"><code>&#x25C0; (Left Arrow)</code></td>
                    <td class="key"><code>A</code></td>
                </tr>
                <tr>
                    <td class="action"><code>Move Right</code></td>
                    <td class="key"><code>&#x25B6; (Right Arrow)</code></td>
                    <td class="key"><code>D</code></td>
                </tr>
                <tr>
                    <td class="action"><code>Move Up</code></td>
                    <td class="key"><code>&#x25B2; (Up Arrow)</code></td>
                    <td class="key"><code>W</code></td>
                </tr>
                <tr>
                    <td class="action"><code>Move Down</code></td>
                    <td class="key"><code>&#x25BC; (Down Arrow)</code></td>
                    <td class="key"><code>S</code></td>
                </tr>
                <tr>
                    <td class="action"><code>Pause</code></td>
                    <td class="key"><code>SPACEBAR</code></td>
                    <td class="key"><code>Esc</code></td>
                </tr>
                <tr>
                    <td class="action"><code>Resume</code></td>
                    <td class="key"><code>SPACEBAR</code></td>
                    <td class="key"><code>Esc</code></td>
                </tr>
                <tr>
                    <td class="action"><code>Restart</code></td>
                    <td class="key"><code>R</code></td>
                    <td class="key"><code> &nbsp; </code></td>
                </tr>
            </table>
        `;
        // overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.style.display = 'none';
        // overlay > content
        this.content = document.createElement('div');
        this.content.className = 'modal-content';
        // content > header
        this.header = document.createElement('header');
        this.header.className = 'modal-header';
        // header > title
        this.title = document.createElement('h2');
        this.title.className = 'modal-title';
        // header > close button
        this.close = document.createElement('button');
        this.close.className = 'modal-close btn btn-small';
        this.close.innerHTML = '&times;';
        // content > body
        this.body = document.createElement('div');
        this.body.className = 'modal-body';
        // body > character div
        this.character = document.createElement('div');
        this.character.className = 'modal-character';
        // character > select character
        let characterSelect = document.createElement('span');
        characterSelect.className = 'modal-character-select';
        characterSelect.innerHTML = 'Select Character';
        // character > character image
        this.characterImage = document.createElement('img');
        this.characterImage.className = 'modal-character-image';
        this.characterImage.src = this.sprite;
        this.characterImage.alt = 'character';
        let bgImage = document.createElement('img');
        bgImage.className = 'modal-character-image bg-image';
        bgImage.src = this.rowImages[this.rowImages.length - 1];
        bgImage.alt = 'character background';
        bgImage.style.marginTop = '30px';
        // character > left arrow
        this.leftArrow = document.createElement('button');
        this.leftArrow.className = 'character-left-arrow btn btn-small';
        this.leftArrow.innerHTML = '&#x25C0;';
        this.leftArrow.onclick = this.prevSprite.bind(this);
        // character > right arrow
        this.rightArrow = document.createElement('button');
        this.rightArrow.className = 'character-right-arrow btn btn-small';
        this.rightArrow.innerHTML = '&#x25B6;';
        this.rightArrow.onclick = this.nextSprite.bind(this);
        // body > text div
        this.text = document.createElement('div');
        this.text.className = 'modal-text';
        // content > footer
        this.footer = document.createElement('footer');
        this.footer.className = 'modal-footer';
        // footer > hints text
        this.hintText = document.createElement('span');
        this.hintText.className = 'modal-footer-tips';
        this.hintText.innerHTML = `Tip: ${this.tips[Math.floor(Math.random() * this.tips.length)]}`;
        this.hintText.addEventListener('click', this.nextTip.bind(this));
        // footer > buttons
        this.buttons = document.createElement('div');
        this.buttons.className = 'modal-buttons';
        // buttons > restart button
        this.restartButton = document.createElement('button');
        this.restartButton.className = 'modal-restart-btn btn';
        this.restartButton.innerHTML = 'Restart Game';
        this.restartButton.style.display = 'none';
        // buttons > resume button
        this.resumeButton = document.createElement('button');
        this.resumeButton.className = 'modal-resume-btn btn';
        this.resumeButton.innerHTML = 'Resume';
        this.resumeButton.style.display = 'none';
        // footer > text
        this.footerText = document.createElement('p');
        this.footerText.className = 'modal-footer-text';
        this.footerText.innerHTML = 'Made with &hearts; by <a href="https://github.com/shreekunj-patel">Shreekunj Patel</a>';

        // append elements
        this.header.appendChild(this.title);
        this.header.appendChild(this.close);
        this.character.appendChild(characterSelect);
        this.character.appendChild(bgImage);
        this.character.appendChild(this.characterImage);
        this.character.appendChild(this.leftArrow);
        this.character.appendChild(this.rightArrow);
        this.body.appendChild(this.character);
        this.body.appendChild(this.text);
        this.buttons.appendChild(this.restartButton);
        this.buttons.appendChild(this.resumeButton);
        this.footer.appendChild(this.hintText);
        this.footer.appendChild(this.buttons);
        this.footer.appendChild(this.footerText);
        this.content.appendChild(this.header);
        this.content.appendChild(this.body);
        this.content.appendChild(this.footer);
        this.overlay.appendChild(this.content);
        document.body.appendChild(this.overlay);

        this.style();
    }
    // get isHidden
    get isHidden() {
        return this.overlay.style.display === 'none';
    }
    // style modal
    style() {
        // TODO: style modal
    }
    // restart game
    restart() {
        this.hide();
        game.reset();
    }
    // resume game
    resume() {
        this.hide();
        if (!game.isAnimating()) {
            game.resume();
        }
    }
    // type: game-over, pause, welcome
    typePause(){
        // set title
        this.title.innerHTML = 'Game Paused';
        // set text
        this.text.innerHTML = `
            <ul class="game-stats"><span>Game Stats:</span>
                <li>Score: <span>${game.score}</span></li>
                <li>Level: <span>${game.level}</span></li>
                <li>Lives: <span>${game.lives}</span></li>
            </ul>
            ${this.controls}
        `;
        // set buttons
        this.restartButton.style.display = 'inline-block';
        this.restartButton.innerHTML = 'Restart Game';
        this.resumeButton.style.display = 'inline-block';
        this.resumeButton.innerHTML = 'Continue';

        // onclick events
        this.restartButton.onclick = this.restart.bind(this);
        this.resumeButton.onclick = this.resume.bind(this);
    }
    typeGameOver(){
        // set title
        this.title.innerHTML = 'Game Over';
        // set text
        this.text.innerHTML = `
            <ul class="game-stats"> Final Stats:
                <li>Score: <span>${game.score}</span></li>
                <li>Level: <span>${game.level}</span></li>
            </ul>
            ${this.controls}

        `;
        // set buttons
        this.restartButton.style.display = 'inline-block';
        this.restartButton.innerHTML = 'Play Again';
        this.resumeButton.style.display = 'none';
        // onclick events
        this.restartButton.onclick = this.restart.bind(this);
    }
    typeWelcome(){
        // set title
        this.title.innerHTML = 'Frogger Game';
        // set text
        this.text.innerHTML = `
            <ul>Welcome
                <li>Start By Selecting Your Character</li>
                <li>Then Click on the Play Button to Start the Game</li>
                <li>All you have to do is cross the road without getting hit by the bugs</li>
                <li>Have Fun!</li>
            </ul>
            ${this.controls}
        `;
        // set buttons
        this.restartButton.style.display = 'inline-block';
        this.restartButton.innerHTML = 'Play';
        this.resumeButton.style.display = 'none';
        // onclick events
        this.restartButton.onclick = this.restart.bind(this);
    }
    typeRestart(){
        // set title
        this.title.innerHTML = 'Restart Game?';
        // set text
        this.text.innerHTML = `
            <h3>Are you sure you want to restart the game?</h3>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;Your current progress will be lost</p>
            <ul class="game-stats">
                <span>Game Stats:</span>
                <li>Score: <span>${game.score}</span></li>
                <li>Level: <span>${game.level}</span></li>
                <li>Lives: <span>${game.lives}</span></li>
            </ul>
        `;
        // set buttons
        this.restartButton.style.display = 'inline-block';
        this.restartButton.innerHTML = 'Yes';
        this.resumeButton.style.display = 'inline-block';
        this.resumeButton.innerHTML = 'No';
        // onclick events
        this.restartButton.onclick = this.restart.bind(this);
        this.resumeButton.onclick = this.resume.bind(this);

    }
    // check type
    checkType() {
        switch (this.type) {
            case 'game-over':
                this.close.onclick = this.restart.bind(this);
                this.typeGameOver();
                break;
            case 'pause':
                this.close.onclick = this.resume.bind(this);
                this.typePause();
                break;
            case 'welcome':
                this.close.onclick = this.restart.bind(this);
                this.typeWelcome();
                break;
            case 'restart':
                this.close.onclick = this.resume.bind(this);
                this.typeRestart();
                break;
        }
    }
    show() {
        this.checkType();
        this.overlay.style.display = 'block';
    }

    hide() {
        this.overlay.style.display = 'none';
    }

    setText(text) {
        this.text.innerHTML = text;
    }

    // if left arrow is clicked or left or up key is pressed
    prevSprite() {
        let index = player_sprites.indexOf(this.sprite);
        index--;
        index = index < 0 ? player_sprites.length - 1 : index;
        this.sprite = player_sprites[index];
        this.characterImage.src = this.sprite;
        player.sprite = this.sprite;
    }

    // if right arrow is clicked or right or down key is pressed
    nextSprite() {
        let index = player_sprites.indexOf(this.sprite);
        index++;
        index = index > player_sprites.length - 1 ? 0 : index;
        this.sprite = player_sprites[index];
        this.characterImage.src = this.sprite;
        player.sprite = this.sprite;
    }

    nextTip() {
        let tip = this.hintText.innerHTML.replace('Tip: ', '');
        let index = this.tips.indexOf(tip);
        index++;
        index = index > this.tips.length - 1 ? 0 : index;
        tip = this.tips[index];
        this.hintText.innerHTML = `Tip: ${tip}`;
    }

    // keyup event handler
    // if key is Esc, close modal
    keyUpHandler(e) {
        if (e.keyCode == 37 || e.keyCode == 38) {
            this.leftArrowClicked();
        } else if (e.keyCode == 39 || e.keyCode == 40) {
            this.rightArrowClicked();
        } else if (e.keyCode == 27) {
            this.hide();
        }
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

// for responsive design
canvasWidth = () => {
    // canvas width
    let width = window.innerWidth < 535 ? window.innerWidth - 30 : 505;
    width = width < 360 ? 360 : width;
    return width;
};
canvasHeight = () => {
    return canvasWidth() * 1.2; // 1.2 is canvas's height to width ratio
};
tileWidth = () => {
    return Math.round(canvasWidth() / 5); // 5 is no. of columns
};
tileHeight = () => {
    return Math.round(tileWidth() * 0.8218); // 0.8218 is ratio of height to width for tile
};
imageWidth = () => {
    return tileWidth();
};
imageHeight = () => {
        return Math.round(tileWidth() * 1.6931); // 1.6931 is ratio of height to width for image
};

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
        37: 'left', // left arrow
        65: 'left', // A
        38: 'up', // up arrow
        87: 'up', // W
        39: 'right', // right arrow
        68: 'right', // D
        40: 'down', // down arrow
        83: 'down', // S
        32: 'pause', // space
        27: 'pause', // esc
        82: 'restart', // R
    };

    player.handleInput(allowedKeys[e.keyCode]);
});