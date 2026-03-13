class StartScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScreen'});
    }

    preload() {
        this.load.image('homeScreenBG', './assets/home_screen.png');
        this.load.image('playButton', './assets/play_button.png');
        this.load.image('instructionButton', './assets/instruction_button.png');
    }

    create() {
        // setting up background image
        this.add.image(320, 180, 'homeScreenBG');

        // setting up the play button
        gameState.playButton = this.add.image(318, 154, 'playButton');
        gameState.playButton.setInteractive();
		gameState.playButton.on('pointerup', () => {
			this.scene.stop('StartScreen');
			this.scene.start('Menu');
		});
        gameState.playButton.on('pointerover', () => {
            gameState.playButton.setTint(0xAAAAAA);
        });
        gameState.playButton.on('pointerout', () => {
            gameState.playButton.clearTint();
        });

        // setting up the instruction button
        gameState.instructionButton = this.add.image(318, 209, 'instructionButton');
        gameState.instructionButton.setInteractive();
        gameState.instructionButton.on('pointerup', () => {
            this.scene.stop('StartScreen');
            this.scene.start('Instructions');
        });
        gameState.instructionButton.on('pointerover', () => {
            gameState.instructionButton.setTint(0xAAAAAA);
        });
        gameState.instructionButton.on('pointerout', () => {
            gameState.instructionButton.clearTint();
        });
    }
}