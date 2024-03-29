var gravity = 0.2;
const lowGravity = 0.05;
const terminalVel = 3;
const playerSize = 5;
var jumpVel = -3;
const lowGravityJump = -1.5;
const activationLevel = 0.5;

var Player = function(isAI, brain) {
	if (easyMode && gravity != lowGravity) {
		gravity = lowGravity;
		jumpVel = lowGravityJump;
	}
	this.x = canvas.width * 0.2;
	this.y = canvas.height / 2;
	this.velocityY = 0;
	this.dead = false;
	this.colour = '#FF0000';
	this.brain;
	this.fitnessScore = 0;
	this.fitness = 0.0;
	this.score = 0;

	if (isAI) {
		this.colour = '#FF000044';
		if (brain == null) {
			this.brain = new NeuralNetwork(5, 8, 8, 1);
		} else {
			this.brain = brain;
		}
	}

	this.jump = function() {
		this.velocityY = jumpVel;
	}

	this.checkDead = function() {
		if (this.y + playerSize > canvas.height || this.y - playerSize < 0) {
			if (!easyMode) {
				this.dead = true;
			}
			return true;
		} else {
			return false;
		}
	}

	this.die = function() {
		this.dead = true;
	}

	this.think = function(nextWall) {
		var inputs = [(this.y / canvas.height), (nextWall[0] / canvas.width), (nextWall[1] / canvas.height), (nextWall[2] / canvas.height), ((this.velocityY / 2) + (terminalVel / 2) / terminalVel)];
		var output = this.brain.predict(inputs);

		if (output[0] > activationLevel) {
			this.jump();
		}
	}

	this.update = function() {
		if (this.dead != true) {
			if (this.score >= 100) {
				this.fitnessScore += 1;
				this.die();
			}
			this.velocityY += gravity;
			if (this.velocityY > terminalVel) {
				this.velocityY = terminalVel;
			} else if (this.velocityY < -terminalVel) {
				this.velocityY = -terminalVel;
			}
			this.y = this.y += this.velocityY;
			if (easyMode) {
				if (this.y - playerSize < 0) {
					this.fitnessScore -= 0.002;
					this.y = 0 + playerSize;
				} else if (this.y + playerSize > canvas.height) {
					this.fitnessScore -= 0.002;
					this.y = canvas.height - playerSize;
				}
				if (this.fitnessScore < 0)
					this.fitnessScore = 0;
			}
		}
	}

	this.passedWall = function() {
		if (this.dead != true) {
			this.fitnessScore += 0.005;
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