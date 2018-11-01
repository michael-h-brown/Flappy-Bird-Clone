
var mutationRate = 0.3;
const highMutation = 0.5;

var goodAIs = [];
var goodAIFitnessScores = [];
var goodAIFitnesses = [];

function nextGen() {

	if (easyMode) {
		mutationRate = highMutation;
	}

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
		r = r - goodAIFitnesses[index];
		index++;
	}
	index--;

	var child = goodAIs[index].brain.copy();
	child.mutate(mutate);
	return child;
}

function calculateFitness() {

	var noGoodAIs = goodAIs.length == 0;

	for (var i = 0; i < noOfAI; i+=1) {
		if (noGoodAIs) {
			goodAIs.push(new Player(true, ais[i].brain.copy()));
			goodAIFitnessScores.push(ais[i].fitnessScore);
			goodAIFitnesses.push(0);
		} else {
			for (var j = 0; j < noOfAI; j+=1) {
				if (ais[i].fitnessScore > goodAIFitnesses[j]) {
					goodAIs[j] = new Player(true, ais[i].brain.copy());
					goodAIFitnessScores[j] = ais[i].fitnessScore;
					goodAIFitnesses[j] = 0;
					break;
				}
			}
		}
	}

	var sum = 0;
	for (var i = 0; i < noOfAI; i+= 1) {
		sum += goodAIFitnessScores[i];
	}

	for (var i = 0; i < noOfAI; i+= 1) {
		goodAIFitnesses[i] = goodAIFitnessScores[i] / sum;
	}
}