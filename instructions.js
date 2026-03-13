class Instructions extends Phaser.Scene {
    constructor() {
        super({ key: 'Instructions' });
    }

    preload() {
        this.load.image('background', './assets/blue_arrow_background.png');
        this.load.image('backButton', './assets/back_button.png');
    }

    create() {
        // setting up background image
        this.add.image(320, 180, 'background').setScale(0.4);

        // setting up the instructions text
        const instructionsText = "Welcome to the Gravity Flip! \n\n" +
            "The objective of the game is to keep the square from touching the left side of the screen by avoiding the obstacles. \n\n" +
            "To do this, you can press the space bar or click the mouse to flip the gravity. \n\n" +
            "Good luck!";
        
        this.add.text(50, 50, instructionsText, {
            font: '16px Roboto',
            fill: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            padding: { x: 10, y: 10 },
            wordWrap: { width: 540 }
        });

        // setting up the play button
        gameState.playButton = this.add.image(318, 300, 'backButton');
        gameState.playButton.setInteractive();
		gameState.playButton.on('pointerup', () => {
			this.scene.stop('Instructions');
			this.scene.start('StartScreen');
		});
        gameState.playButton.on('pointerover', () => {
            gameState.playButton.setTint(0xAAAAAA);
        });
        gameState.playButton.on('pointerout', () => {
            gameState.playButton.clearTint();
        });
    }
}