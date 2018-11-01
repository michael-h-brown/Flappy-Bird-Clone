
var canvas, ctx, handler, player, spawner, score, canJump;

const easyMode = true;

var ais = [];
var aiScores = [];
var generation = 0;
var aiHighScore = 0;
var frameCounter = 0;
var paused = false;

const noOfAI = 500;
const noOfAISeen = 25;
const speed = 4;

function pause() {
	if (paused == false) {
		paused = true;
		return 'Paused!';
	} else {
		paused = false;
		requestAnimationFrame(gameLoop);
		return 'Resumed!';
	}
}

var StateHandler = function() {
	this.state = 'menu';

	this.nextGameState = function() {
		if (this.state == 'menu') {
			this.state = 'game';
		} else if (this.state == 'game') {
			this.state = 'endgame';
		} else if (this.state == 'endgame') {
			this.state = 'game';
		}
	}

	this.nextAIState = function() {
		if (this.state == 'menu') {
			this.state = 'ai';
		}
	}

	this.animate = function() {

		ctx.fillStyle = '#66AAFF';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		if (this.state == 'menu') {
			menu();
		} else if (this.state == 'game') {
			game();
		} else if (this.state == 'endgame') {
			endgame();
		} else if (this.state == 'ai') {
			gameAI();
		}
	};
}

function setup() {
	canvas = document.getElementById('maincanvas');
	ctx = canvas.getContext('2d');

	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	handler = new StateHandler();
	score = 0;
	canJump = true;
	gameLoop();
}

function menu() {
	document.body.onkeyup = function(e) {
		if (e.keyCode == 32) {
			player = new Player(false, null);
			spawner = new WallSpawner();
			score = 0;
			handler.nextGameState();
		} else if (e.keyCode == 65) {
			for (var i = 0; i < noOfAI; i+=1) {
				ais.push(new Player(true, null));
				aiScores.push(0);
			}
			spawner = new WallSpawner();
			handler.nextAIState();
		}
	}
	ctx.moveTo(canvas.width/2, canvas.height/2);
	ctx.fillStyle = '#000000';
	ctx.fillText('Press Space to Start! Or \'A\' for AI!', canvas.width/4, canvas.height/2);
}

function game() {
	document.body.onkeydown = function(e) {
		if (e.keyCode == 32 && canJump) {
			player.jump();
			canJump = false;
		}
	}
	document.body.onkeyup = function(e) {
		if (e.keyCode == 32) {
			canJump = true;
		}
	}
	spawner.update();
	player.update()
	var hasCollided = spawner.checkCollisions(player.x, player.y, playerSize);
	if (hasCollided == 2) {
		score += 1;
	} else if (hasCollided == 1) {
		handler.nextGameState();
	}
	var isDead = player.checkDead();
	if (isDead) {
		handler.nextGameState();
	}
	spawner.draw();
	player.draw();
	ctx.fillStyle = '#000000';
	ctx.fillText(score.toString(), canvas.width / 2, 20);
}

function gameAI() {
	frameCounter += 1;

	for (var j = 0; j < speed; j+=1) {
		spawner.update();

		var allDead = true;
		for (var i = 0; i < ais.length; i += 1) {
			if (ais[i].dead == false) {
				allDead = false;
				ais[i].think(spawner.nextWall());
				ais[i].update();
				var hasCollided = spawner.checkCollisions(ais[i].x, ais[i].y, playerSize);
				if (hasCollided == 2) {
					aiScores[i] += 1;
					if (aiScores[i] > aiHighScore) {
						aiHighScore = aiScores[i];
					}
				} else if (hasCollided == 1) {
					ais[i].die();
				}
				ais[i].checkDead();
			}
		}

	}

	aiCount = 0;
	for (var i = 0; i < ais.length; i+=1) {
		if (ais[i].dead == false) {
			ais[i].draw();
			aiCount += 1
		}

		if (aiCount > noOfAISeen) {
			break;
		}
	}

	if (allDead) {
		generation += 1;
		nextGen();
		spawner = new WallSpawner();
		handler.nextAIState();
	}

	spawner.draw();
	ctx.fillStyle = '#000000';
	ctx.fillText('Generation: ' + generation.toString(), canvas.width / 2.5, 20);
	ctx.fillText('High Score: ' + aiHighScore.toString(), canvas.width / 2.5, 40);
}

function endgame() {
	document.body.onkeyup = function(e) {
		if (e.keyCode == 32) {
			player = new Player(false, null);
			spawner = new WallSpawner();
			score = 0;
			handler.nextGameState();
		}
	}
	ctx.fillStyle = '#000000';
	ctx.fillText(score.toString(), canvas.width / 2, 20);
	ctx.fillStyle = '#000000';
	ctx.fillText('Game Over Press Space to Restart!', canvas.width/4, canvas.height/2);
}

function gameLoop() {
	if (paused == false) {
		handler.animate();
		requestAnimationFrame(gameLoop);
	}
}

document.onload = setup();