const gravity = 0.2;
const terminalVel = 3;
const playerSize = 5;
const jumpVel = -3;
const activationLevel = 0.5;

var Player = function(isAI, brain) {
	this.x = canvas.width * 0.2;
	this.y = canvas.height / 2;
	this.velocityY = 0;
	this.dead = false;
	this.colour = '#FF0000';
	this.brain;
	this.fitnessScore = 0;
	this.fitness = 0.0;

	if (isAI) {
		this.colour = '#FF000044';
		if (brain == null) {
			this.brain = new NeuralNetwork(5, 5, 1);
		} else {
			this.brain = brain;
		}
	}

	this.jump = function() {
		this.velocityY = jumpVel;
	}

	this.checkDead = function() {
		if (this.y + playerSize > canvas.height || this.y - playerSize < 0) {
			this.dead = true;
			return true;
		} else {
			return false;
		}
	}

	this.die = function() {
		this.dead = true;
	}

	this.think = function(nextWall) {
		var inputs = [(this.y / canvas.height), (nextWall[0] / canvas.width), (nextWall[1] / canvas.height), (nextWall[2] / canvas.height), (this.velocityY / terminalVel)];
		var output = this.brain.predict(inputs);

		if (output[0] > activationLevel) {
			this.jump();
		}
	}

	this.update = function() {
		if (this.dead != true) {
			this.fitnessScore += 1;
			this.velocityY += gravity;
			if (this.velocityY > terminalVel) {
				this.velocityY = terminalVel;
			} else if (this.velocityY < -terminalVel) {
				this.velocityY = -terminalVel;
			}
			this.y = this.y += this.velocityY;
		}
	}

	this.draw = function() {
		if (this.dead != true) {
			ctx.beginPath();
			ctx.fillStyle = this.colour;
			ctx.arc(this.x, this.y, playerSize, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}