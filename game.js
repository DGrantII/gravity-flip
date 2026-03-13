const gameState = {
	gameOver: false
}

const config = {
	type: Phaser.AUTO,
	width: 640,
	height: 360,
	backgroundColor: "000000",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 0},
			enableBody: true,
			debug: false,
		}
	},
	scene: [StartScreen, Instructions, Menu, Level]
}

const game = new Phaser.Game(config);