
var canvas, ctx, handler, player;//, spawner;

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
	gameLoop();
}

function menu() {
	document.body.onkeyup = function(e) {
		if (e.keyCode == 32) {
			player = new Player();
			//spawner = new WallSpawner();
			handler.nextState();
		}
	}
	ctx.moveTo(canvas.width/2, canvas.height/2);
	ctx.fillStyle = '#000000';
	ctx.fillText('Press Space to Start!', canvas.width/3, canvas.height/2);
}

function game() {
	document.body.onkeyup = function(e) {
		if (e.keyCode == 32) {
			player.jump();
		}
	}
	player.update()
	var isDead = player.checkDead();
	if (isDead) {
		handler.nextState();
	}
	player.draw();
}

function endgame() {
	document.body.onkeyup = function(e) {
		if (e.keyCode == 32) {
			player = new Player();
			handler.nextState();
		}
	}
	ctx.moveTo(canvas.width/2, canvas.height/2);
	ctx.fillStyle = '#000000';
	ctx.fillText('Game Over Press Space to Restart!', canvas.width/4, canvas.height/2);
}

function gameLoop() {
	handler.animate();
	requestAnimationFrame(gameLoop);
}

document.onload = setup();