
var canvas, ctx, handler, player, spawner, score, canJump;

var StateHandler = function() {
	this.state = 'menu';

	this.nextState = function() {
		if (this.state == 'menu') {
			this.state = 'game';
		} else if (this.state == 'game') {
			this.state = 'endgame';
		} else if (this.state == 'endgame') {
			this.state = 'game';
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
			player = new Player();
			spawner = new WallSpawner();
			score = 0;
			handler.nextState();
		}
	}
	ctx.moveTo(canvas.width/2, canvas.height/2);
	ctx.fillStyle = '#000000';
	ctx.fillText('Press Space to Start!', canvas.width/3, canvas.height/2);
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
		handler.nextState();
	}
	var isDead = player.checkDead();
	if (isDead) {
		handler.nextState();
	}
	spawner.draw();
	player.draw();
	ctx.fillStyle = '#000000';
	ctx.fillText(score.toString(), canvas.width / 2, 20);
}

function endgame() {
	document.body.onkeyup = function(e) {
		if (e.keyCode == 32) {
			player = new Player();
			spawner = new WallSpawner();
			score = 0;
			handler.nextState();
		}
	}
	ctx.fillStyle = '#000000';
	ctx.fillText(score.toString(), canvas.width / 2, 20);
	ctx.fillStyle = '#000000';
	ctx.fillText('Game Over Press Space to Restart!', canvas.width/4, canvas.height/2);
}

function gameLoop() {
	handler.animate();
	requestAnimationFrame(gameLoop);
}

document.onload = setup();