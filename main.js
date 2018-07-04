class TennisGame {
	constructor(canvas) {
		this.canvas = canvas;
		this.canvasContext = this.canvas.getContext('2d');
		this.canvasColor = '#000000';
		this.ballColor = '#FFFFFF';
		this.paddleColor = '#FFFFFF';

		this._runGame();
	}

	_runGame() {
		const FPS = 60;
		const BALL_SIZE = 10;

		let playerScore = 0;
		let aiScore = 0;

		let ballSpeedX = 5;
		let ballSpeedY = 5;
		let ballX = 0;
		let ballY = 0;

		const PADDLE_HEIGHT = 100;
		const PADDLE_THICKNESS = 10;

		let paddleY = (this.canvas.height - PADDLE_HEIGHT) / 2;
		let aiY = (this.canvas.height - PADDLE_HEIGHT) / 2;

		this.canvas.addEventListener('mousemove', (event) => {
			let mousePosition = this._getMousePosition(event);
			paddleY = mousePosition.y - PADDLE_HEIGHT / 2;
		});

		setInterval(() => {
			aiMovement();

			if (ballX < PADDLE_THICKNESS) {
				if (ballY > paddleY && ballY < paddleY + PADDLE_HEIGHT) {
					ballSpeedX = -ballSpeedX;

					let deltaY = ballY - (paddleY + PADDLE_HEIGHT / 2);
					ballSpeedY = deltaY * 0.35;
				} else {
					reset();
					aiScore++;
				}
			}

			if (ballX > this.canvas.width - PADDLE_THICKNESS) {
				if (ballY > aiY && ballY < aiY + PADDLE_HEIGHT) {
					ballSpeedX = -ballSpeedX;
				} else {
					reset();
					playerScore++;
				}
			}

			if (ballY < 0) {
				ballSpeedY = -ballSpeedY;
			}

			if (ballY > this.canvas.height) {
				ballSpeedY = -ballSpeedY;
			}

			// Draw canvas
			this._drawRect(0, 0, this.canvas.width, this.canvas.height, this.canvasColor);
			this._drawNet();

			// Draw user paddle
			this._drawRect(0, paddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, this.paddleColor);

			// Draw AI paddle
			this._drawRect(
				this.canvas.width - PADDLE_THICKNESS,
				aiY,
				PADDLE_THICKNESS,
				PADDLE_HEIGHT,
				this.paddleColor
			);

			// Draw ball
			this._drawArc((ballX += ballSpeedX), (ballY += ballSpeedY), BALL_SIZE, this.ballColor);

			// Draw score
			this._drawScore(playerScore, aiScore);
		}, 1000 / FPS);

		const reset = () => {
			ballX = this.canvas.width / 2;
			ballY = this.canvas.height / 2;
			ballSpeedX = -ballSpeedX;
			ballSpeedY = ballSpeedY === 5 ? -ballSpeedY : 5;
		};

		const aiMovement = () => {
			let aiCenter = aiY + PADDLE_HEIGHT / 2;
			if (aiCenter < ballY - 35) {
				aiY += 6;
			} else if (aiCenter > ballY + 35) {
				aiY -= 6;
			}
		};
	}

	_drawRect(x, y, width, heigth, color) {
		this.canvasContext.fillStyle = color;
		this.canvasContext.fillRect(x, y, width, heigth);
	}

	_drawArc(x, y, radius, color) {
		this.canvasContext.fillStyle = color;
		this.canvasContext.beginPath();
		this.canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
		this.canvasContext.fill();
	}

	_getMousePosition(event) {
		let rect = this.canvas.getBoundingClientRect();
		let root = document.documentElement;

		return {
			x: event.clientX - rect.left - root.scrollLeft,
			y: event.clientY - rect.top - root.scrollTop
		};
	}

	_drawScore(player, ai) {
		this.canvasContext.fillText('score: ', 100, 100);
		this.canvasContext.fillText(player, 250, 100);
		this.canvasContext.fillText(ai, this.canvas.width - 250, 100);
	}

	_drawNet() {
		for (let i = 0; i < this.canvas.height; i += 40) {
			this._drawRect(this.canvas.width / 2 - 1, i + 10, 2, 20, '#ffffff');
		}
	}
}

window.onload = () => {
	let game = new TennisGame(document.querySelector('canvas#gameSpace'));
};
