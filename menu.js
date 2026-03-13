class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    preload() {
        this.load.image('background', './assets/blue_arrow_background.png');
        this.load.image('homeButton', './assets/home_button.png');
        this.load.image('block', './assets/block.png');
        this.load.image('one', './assets/one.png');
        this.load.image('two', './assets/two.png');
        this.load.image('three', './assets/three.png');
        this.load.image('four', './assets/four.png');
    }

    levelButtons(level) {

    }

    create() {
        // setting up the background
        this.add.image(320, 180, 'background').setScale(0.4);

        // adding the home button
        gameState.homeButton = this.add.image(70, 35, 'homeButton');
        gameState.homeButton.setInteractive();
        gameState.homeButton.on('pointerup', () => {
            this.scene.stop('Menu');
            this.scene.start('StartScreen');
        });
        gameState.homeButton.on('pointerover', () => {
            gameState.homeButton.setTint(0xAAAAAA);
        });
        gameState.homeButton.on('pointerout', () => {
            gameState.homeButton.clearTint();
        });

        // adding the level buttons
        const iconArray = ['one', 'two', 'three', 'four'];
        gameState.levelButtons = [];

        // initiallizing the coordinates
        let x = 70;
        let y = 110;

        for (let i = 1; i <= levelContent.length; i++) {

            const buttonObject = {};

            // creating the buttons and setting up the interactivity
            buttonObject.button = this.add.image(x, y, 'block').setInteractive().setScale(0.7);
            buttonObject.icon = this.add.image(x, y, iconArray[i-1]);
            buttonObject.button.on('pointerup', () => {
                gameState.level = i;
                this.scene.stop('Menu');
                this.scene.start('Level');
            });

            if (levelContent[i-1].locked) {
                buttonObject.button.setTint(0x555555);
                buttonObject.icon.setTint(0x555555);
                buttonObject.button.disableInteractive();
            } else {
                buttonObject.button.on('pointerover', () => {
                    buttonObject.button.setTint(0xAAAAAA);
                    buttonObject.icon.setTint(0xAAAAAA);
                });
                buttonObject.button.on('pointerout', () => {
                    buttonObject.button.clearTint();
                    buttonObject.icon.clearTint();
                });
            }

            // adding the button and icon to the gameState for later reference
            gameState.levelButtons.push(buttonObject);

            // updating the coordinates for the next button
            x += 70;
        }
    }
}