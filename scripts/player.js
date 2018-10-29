const gravity = 0.2;
const terminalVel = 3;
const playerSize = 5;
const jumpVel = -3;

var Player = function() {
	this.x = canvas.width * 0.2;
	this.y = canvas.height / 2;
	this.velocityY = 0;
	this.dead = false;

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

	this.update = function() {
		if (this.dead != true) {
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
		ctx.beginPath();
		ctx.fillStyle = '#FF0000';
		ctx.arc(this.x, this.y, playerSize, 0, Math.PI * 2);
		ctx.fill();
	}
}