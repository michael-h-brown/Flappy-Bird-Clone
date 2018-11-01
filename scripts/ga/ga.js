
const mutationRate = 0.1;

function nextGen() {

	calculateFitness();

	newAIs = [];

	for (var i = 0; i < noOfAI; i+= 1) {
		newAIs.push(new Player(true, pickAI()));
		aiScores[i] = 0;
	}

	ais = newAIs;
}

//Random Gaussian from Colin Godsey
//http://www.meredithdodge.com/2012/05/30/a-great-little-javascript-function-for-generating-random-gaussiannormalbell-curve-numbers/
Math.nrand = function() {
	var x1, x2, rad, y1;
	do {
		x1 = 2 * this.random() - 1;
		x2 = 2 * this.random() - 1;
		rad = x1 * x1 + x2 * x2;
	} while(rad >= 1 || rad == 0);
	var c = this.sqrt(-2 * Math.log(rad) / rad);
	return x1 * c;
};

function mutate(x) {
	if (Math.random < mutationRate) {
		var offset = Math.nrand() * 0.5;
		var newX = x + offset;
		return newX;
	} else {
		return x;
	}
}

function pickAI() {
	var index = 0;
	var r = Math.random();

	while (r > 0) {
		r = r - ais[index].fitness;
		index++;
	}
	index--;

	var child = ais[index].brain.copy();
	child.mutate(mutate);
	return child;
}

function calculateFitness() {
	var sum = 0;
	for (var i = 0; i < noOfAI; i+= 1) {
		sum += ais[i].fitnessScore;
	}

	for (var i = 0; i < noOfAI; i+= 1) {
		ais[i].fitness = ais[i].fitnessScore / sum;
	}
}