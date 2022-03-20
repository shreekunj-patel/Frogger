/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function (global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas element's height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        // controls
        navButtonsDiv = doc.createElement('div'),
        lastTime;

    // canvas.width = 505;
    // canvas.height = 606;

    // Making canvas responsive
    canvas.width = win.innerWidth < 535 ? win.innerWidth - 30 : 505;
    canvas.width = canvas.width < 360 ? 360 : canvas.width;
    canvas.height = canvas.width * 1.2;

    win.addEventListener('resize', () => {
        canvas.width = win.innerWidth < 535 ? win.innerWidth - 30 : 505;
        canvas.width = canvas.width < 360 ? 360 : canvas.width;
        canvas.height = canvas.width * 1.2;
        navButtonsDiv.style.maxWidth = canvas.width + "px";
    });

    navButtonsDiv.className = "navigation-buttons";
    navButtonsDiv.style.maxWidth = canvas.width + "px";
    // up button
    upButton = doc.createElement('button');
    upButton.innerHTML = "&#x25B2;";
    upButton.className = "btn btn-small up";
    upButton.onclick = () => {
        player.handleInput('up');
    };
    // down button
    downButton = doc.createElement('button');
    downButton.innerHTML = "&#x25BC;";
    downButton.className = "btn btn-small down";
    downButton.onclick = () => {
        player.handleInput('down');
    };
    // left button
    leftButton = doc.createElement('button');
    leftButton.innerHTML = "&#x25C0;";
    leftButton.className = "btn btn-small left";
    leftButton.onclick = () => {
        player.handleInput('left');
    };
    // right button
    rightButton = doc.createElement('button');
    rightButton.innerHTML = "&#x25B6;";
    rightButton.className = "btn btn-small right";
    rightButton.onclick = () => {
        player.handleInput('right');
    };
    // pause button
    pauseButton = doc.createElement('button');
    pauseButton.innerHTML = "PAUSE";
    pauseButton.style.borderRadius = "7px";
    pauseButton.className = "btn pause";
    pauseButton.onclick = () => {
        player.handleInput('pause');
    };
    // restart button
    restartButton = doc.createElement('button');
    restartButton.innerHTML = "RESTART";
    restartButton.className = "btn restart";
    restartButton.onclick = () => {
        player.handleInput('restart');
    };
    // add buttons to navigation buttons div
    navButtonsDiv.appendChild(upButton);
    navButtonsDiv.appendChild(downButton);
    navButtonsDiv.appendChild(leftButton);
    navButtonsDiv.appendChild(rightButton);
    navButtonsDiv.appendChild(pauseButton);
    navButtonsDiv.appendChild(restartButton);

    doc.body.appendChild(canvas);
    doc.body.appendChild(navButtonsDiv);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = game.rowImages,
            numRows = 6,
            numCols = 5,
            row, col,
            tileWidth = canvas.width / numCols,
            tileHeight = tileWidth * 0.8218,
            imageWidth = Math.round(tileWidth),
            imageHeight = Math.round(tileWidth * 1.6931);

        // Before drawing, clear existing canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * tileWidth, row * tileHeight, imageWidth, imageHeight);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
        game.pause();
        game.modal.show();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/stone-block-2.png',
        'images/stone-block-3.png',
        'images/stone-block-4.png',
        'images/stone-block-5.png',
        'images/water-block.png',
        'images/water-block-2.png',
        'images/water-block-3.png',
        'images/grass-block.png',
        'images/grass-block-2.png',
        'images/grass-block-3.png',
        'images/grass-block-4.png',
        'images/grass-block-5.png',
        'images/grass-block-6.png',
        'images/grass-block-7.png',
        'images/grass-block-8.png',
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
        'images/enemy-bug giant.png',
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
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Heart-mini.png',
        'images/Gem Blue-mini.png',
        'images/Gem Green-mini.png',
        'images/Gem Orange-mini.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);