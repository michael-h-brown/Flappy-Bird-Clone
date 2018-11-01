
const wallDistance = 50;
const wallColor = '#009900';
const wallSpeed = 1;

const timeBtwnWalls = 100;

var WallSpawner = function() {
	this.walls = [];
	this.timer = 0;

	this.update = function() {
		this.timer -= 1;
		if (this.timer <= 0) {
			this.timer = timeBtwnWalls;
			this.walls.push(new Wall(wallDistance, wallColor, wallSpeed, canvas.width));
		}

		for (var i = this.walls.length-1; i >= 0; i-=1) {
			this.walls[i].update();
			if (this.walls[i].destroy) {
				this.walls.splice(i, 1);
			}
		}
	};

	this.nextWall = function() {
		var thisWall;
		for (var i = 0; i < this.walls.length; i+=1) {
			if (this.walls[i].passedThrough == false) {
				thisWall = [this.walls[i].x, this.walls[i].topY, this.walls[i].bottomY];
				break;
			}
		}

		return thisWall;
	};

	this.checkCollisions = function(playerX, playerY, playerRadius) {
		var collided = false;
		var passedWall = false;
		this.walls.forEach(function (wall) {
			if (playerX + playerRadius > wall.x && playerX - playerRadius < (wall.x + wallThickness)) {
				if (playerY < wall.topY || playerY > wall.bottomY) {
					collided = true;
				}
			} else if (playerX + playerRadius > wall.x && playerX - playerRadius > (wall.x + wallThickness)) {
				if (wall.passedThrough == false) {
					wall.passedThrough = true;
					passedWall = true;
				}
			}
		});

		if (collided == false && passedWall == false) {
			return 0;
		} else if (passedWall) {
			return 2;
		} else {
			return 1;
		}
	};

	this.draw = function() {
		this.walls.forEach(function (wall) {
			wall.draw();
		});
	};

};

const wallThickness = 10;

var Wall = function(distance, color, speed, x) {
	this.x = x;
	this.color = color;
	this.speed = speed;
	this.topY = Math.random() * (canvas.height - distance);
	this.bottomY = this.topY + distance;
	this.passedThrough = false;
	this.destroy = false;

	this.update = function() {
		this.x -= this.speed;
		if (this.x <= 0) {
			this.destroy = true;
		}
	};

	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, 0, wallThickness, this.topY);
		ctx.beginPath();
		ctx.fillRect(this.x, this.bottomY, wallThickness, canvas.height - this.bottomY);
	};
};