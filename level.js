// the content for each level, including whether it's complete or locked and a function to generate blocks for the level
const levelContent = [
    {
        level: 1,
        locked: false,
		timer: 20,
        generateBlocks () {
            gameState.blockTimer = this.time.addEvent({
                delay: 1500,
                callback: () => {
                    if (!this.physics.world.isPaused) {
                        const block = gameState.blocks.create(800, Phaser.Math.Between(70, 290), 'block');
                        block.setBounce(0);
                        block.setVelocityX(-200);
                        block.setImmovable(true);
                    }
                },
                loop: true,
            });
        }
    },
    {
        level: 2,
        locked: true,
		timer: 30,
        generateBlocks () {
            gameState.blockTimer = this.time.addEvent({
                delay: 750,
                callback: () => {
                    if (!this.physics.world.isPaused) {
                        const block = gameState.blocks.create(800, Phaser.Math.Between(70, 290), 'block');
                        block.setBounce(0);
                        block.setVelocityX(-350);
                        block.setImmovable(true);
                    }
                },
                loop: true,
            });
        }
    },
    {
        level: 3,
        locked: true,
        timer: 20,
        generateBlocks () {
            gameState.blockTimer = this.time.addEvent({
                delay: 1500,
                callback: () => {
                    if (!this.physics.world.isPaused) {
                        const block = gameState.blocks.create(800, Phaser.Math.Between(70, 290), 'block');
                        block.setBounce(0);
                        block.setVelocityX(-200);
                        block.setImmovable(true);
                    }
                },
                loop: true,
            });

            let toggle = false;
            gameState.blockTimer2 = this.time.addEvent({
                delay: 1500,
                callback: () => {
                    
                    if (!this.physics.world.isPaused) {
                        let block;
                        if (toggle) {
                            block = gameState.blocks.create(800, 70, 'block');
                        } else {
                            block = gameState.blocks.create(800, 290, 'block');
                        }
                        block.setBounce(0);
                        block.setVelocityX(-200);
                        block.setImmovable(true);

                        toggle = !toggle;
                    }
                },
                loop: true,
            });
        }
    },
    {
        level: 4,
        locked: true,
        timer: 20,
        generateBlocks () {
            gameState.blockTimer = this.time.addEvent({
                delay: 1500,
                callback: () => {
                    if (!this.physics.world.isPaused) {
                        const block = gameState.blocks.create(800, Phaser.Math.Between(70, 290), 'block');
                        block.setBounce(0);
                        block.setVelocityX(-350);
                        block.setImmovable(true);
                    }
                },
                loop: true,
            });

            let toggle = false;
            gameState.blockTimer2 = this.time.addEvent({
                delay: 1500,
                callback: () => {
                    
                    if (!this.physics.world.isPaused) {
                        let block;
                        if (toggle) {
                            block = gameState.blocks.create(800, 70, 'block');
                        } else {
                            block = gameState.blocks.create(800, 290, 'block');
                        }
                        block.setBounce(0);
                        block.setVelocityX(-350);
                        block.setImmovable(true);

                        toggle = !toggle;
                    }
                },
                loop: true,
            });
        }
    }
];

// ----- persistence helpers --------------------------------------------------
const STORAGE_KEY = 'bugDodgerLevels';
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

function getStoredData() {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        if (!json) return null;
        const data = JSON.parse(json);
        if (!data.savedAt || !Array.isArray(data.levels)) return null;
        if (Date.now() - data.savedAt > MONTH_MS) {
            // expired, clear storage
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
        return data;
    } catch (e) {
        console.warn('Failed to parse level storage', e);
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function loadLevelLocks() {
    const data = getStoredData();
    if (data) {
        data.levels.forEach((locked, idx) => {
            if (idx < levelContent.length) {
                levelContent[idx].locked = locked;
            }
        });
    }
}

function saveLevelLocks() {
    const data = {
        levels: levelContent.map(l => l.locked),
        savedAt: Date.now(),
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save level locks', e);
    }
}

// initialize locks from storage when script loads
loadLevelLocks();

class Level extends Phaser.Scene {
    constructor() {
        super({ key: 'Level' });
    }

    preload () {
        this.load.image('blueBG', './assets/blue_arrow_background.png');
        this.load.image('redBG', './assets/red_arrow_background.png');
        this.load.image('platform', './assets/platform.jpg');
        this.load.image('square', './assets/square.png');
        this.load.image('block', './assets/block.png');

        this.load.audio('theme1', './assets/theme1.mp3');
    }

    create () {
        // getting the level data for the current level
        const levelData = levelContent[gameState.level - 1];

        // setting up the background
        gameState.bg = this.add.image(320, 180, 'blueBG');
        gameState.bg.setScale(0.4);

        // playing the sounds
        //gameState.music = this.sound.add('theme1', { loop: true, volume: 0.2 });
        //gameState.music.play();

        // setting up game over state
        gameState.gameOver = false;

        // setting up the player
        gameState.player = this.physics.add.sprite(200, 180, 'square');
        gameState.player.setCollideWorldBounds(true);
        gameState.player.setVelocityY(400);
        gameState.player.setImmovable(false);
        gameState.player.setCollideWorldBounds(true);
        gameState.player.body.onWorldBounds = true;

        // setting up the top and bottom platforms
        gameState.platforms = this.physics.add.staticGroup();
        gameState.platforms.create(320, 360, 'platform');
        gameState.platforms.create(320, 0, 'platform').flipY = true;

        // setting up the collision between the player and the platforms
        this.physics.add.collider(gameState.player, gameState.platforms);

        // setting up the input
        // two for the space bar
        gameState.isPressed = false;
        this.input.keyboard.on('keydown-SPACE', () => {
            gameState.isPressed = true;
            gameState.player.setVelocityY(-400);
            if (!gameState.gameOver) {
                gameState.bg.setTexture('redBG');
            }
        });
        this.input.keyboard.on('keyup-SPACE', () => {
            gameState.isPressed = false;
            gameState.player.setVelocityY(400);
            gameState.bg.setTexture('blueBG');
        });

        // and two for mouse input (ignore clicks on UI buttons)
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            // if the pointer isn't dragging a button or other interactive object
            if (currentlyOver.length === 0 && !this.physics.world.isPaused) {
                gameState.isPressed = true;
                gameState.player.setVelocityY(-400);
                if (!gameState.gameOver) {
                    gameState.bg.setTexture('redBG');
                }
            }
        });
        this.input.on('pointerup', (pointer, currentlyOver) => {
            if (currentlyOver.length === 0 && !this.physics.world.isPaused) {
                gameState.isPressed = false;
                gameState.player.setVelocityY(400);
                if (!gameState.gameOver) {
                    gameState.bg.setTexture('blueBG');
                }
            }
        });

        // setting up the blocks
        gameState.blocks = this.physics.add.group();
        gameState.touchingBlock = false;
        this.physics.add.collider(gameState.player, gameState.blocks, () => {
            gameState.touchingBlock = true;
        });

        // adding a pause button in the top right corner
        gameState.pauseButton = this.add.text(630, 2, 'Pause', { fontSize: '16px', fill: '#000', fontFamily: 'Roboto, serif' }).setOrigin(1, 0).setPadding(5);
        gameState.pauseButton.setInteractive();
        gameState.pauseButton.on('pointerdown', () => {
            if (gameState.gameOver) {
                this.scene.restart();
                gameState.gameOver = false;
            } else {
                if (this.physics.world.isPaused) {
                    this.physics.resume();
                    gameState.pauseButton.setText('Pause');
                    gameState.pauseText.destroy();
                } else {
                    this.physics.pause();
                    gameState.pauseButton.setText('Resume');
                    gameState.pauseText = this.add.text(320, 180, 'Paused', { fontSize: '32px', fill: '#fff', backgroundColor: '#000', fontFamily: 'Roboto, serif' }).setOrigin(0.5).setPadding(10);
                }
            }
        }, null, { useHandCursor: true });

        // adding an effect to the pause button on hover
        gameState.pauseButton.on('pointerover', () => {
            gameState.pauseButton.setStyle({ backgroundColor: '#000', fill: '#fff' });
        });
        gameState.pauseButton.on('pointerout', () => {
            gameState.pauseButton.setStyle({ backgroundColor: 'rgba(0, 0, 0, 0)', fill: '#000' });
        });

        // adding a menu button in the top center
        gameState.menuButton = this.add.text(320, 2, 'Menu', { fontSize: '16px', fill: '#000', fontFamily: 'Roboto, serif' }).setOrigin(0.5, 0).setPadding(5);
        gameState.menuButton.setInteractive();
        gameState.menuButton.on('pointerup', () => {
            //gameState.music.stop();
            this.scene.stop('Level');
            this.scene.start('Menu');
        }, null, { useHandCursor: true });

        gameState.menuButton.on('pointerover', () => {
            gameState.menuButton.setStyle({ backgroundColor: '#000', fill: '#fff' });
        });
        gameState.menuButton.on('pointerout', () => {
            gameState.menuButton.setStyle({ backgroundColor: 'rgba(0, 0, 0, 0)', fill: '#000' });
        });

        // generating the blocks for the level
        levelData.generateBlocks.call(this);

        // setting up a timer to destroy blocks that go off screen every 0.5 seconds
        this.time.addEvent({
            delay: 500,
            callback: () => {
                gameState.blocks.getChildren().forEach(block => {
                    if (block.x < -50) {
                        block.destroy();
                    }
                });
            },
            loop: true,
        });

        // game over condition: if player is touching world bounds, stop the game and display "Game Over"
        this.physics.world.on('worldbounds', () => {
            this.physics.pause();
            this.add.text(320, 180, 'Game Over', { fontSize: '32px', fill: '#fff', backgroundColor: '#000', fontFamily: 'Roboto, serif' }).setOrigin(0.5).setPadding(10);
            gameState.gameOver = true;
            gameState.pauseButton.setText('Restart');
        });

        // displaying the timer and stopping it when the game is over or won
        gameState.timer = levelData.timer;
        gameState.timerText = this.add.text(10, 2, `Time: ${gameState.timer}`, { fontSize: '16px', fill: '#000', fontFamily: 'Roboto, serif' }).setPadding(5);
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.physics.world.isPaused) return;
                gameState.timer--;
                gameState.timerText.setText(`Time: ${gameState.timer}`);
                if (gameState.timer === 0) {
                    this.physics.pause();
                    this.add.text(320, 180, 'Level Complete!', { fontSize: '32px', fill: '#fff', backgroundColor: '#000', fontFamily: 'Roboto, serif' }).setOrigin(0.5).setPadding(10);
                    gameState.gameOver = true;
                    gameState.pauseButton.setText('Restart');

                    // unlocking the next level if there is one
                    let nextLevel = levelData.level + 1;
                    if (nextLevel <= levelContent.length) {
                        levelContent[nextLevel - 1].locked = false;
                        // persist the updated lock state
                        saveLevelLocks();
                    }

                    // adding a button to go to the next level if there is one
                    if (nextLevel <= levelContent.length) {
                        gameState.nextLevelButton = this.add.text(320, 220, 'Next Level', { fontSize: '16px', fill: '#000', backgroundColor: '#fff', fontFamily: 'Roboto, serif' }).setOrigin(0.5).setPadding(5);
                        gameState.nextLevelButton.setInteractive();
                        gameState.nextLevelButton.on('pointerup', () => {
                            gameState.level++;
                            gameState.gameOver = false;
                            this.scene.stop('Level');
                            this.scene.start('Level');
                        }, null, { useHandCursor: true });

                        gameState.nextLevelButton.on('pointerover', () => {
                            gameState.nextLevelButton.setStyle({ backgroundColor: '#000', fill: '#fff' });
                        });
                        gameState.nextLevelButton.on('pointerout', () => {
                            gameState.nextLevelButton.setStyle({ backgroundColor: '#fff', fill: '#000' });
                        });
                    }
                }
            },
            loop: true,
        });

        // displaying level number in bottom left corner
        this.add.text(10, 335, `Level ${gameState.level}`, { fontSize: '16px', fill: '#000', fontFamily: 'Roboto, serif' });
    }

    update () {
        if (!gameState.touchingBlock) {
            gameState.player.setVelocityX(0);
        }
        
        // Maintain vertical velocity based on input state
        if (!gameState.isPressed) {
            gameState.player.setVelocityY(400);
        }
        
        gameState.touchingBlock = false;
    }
}