var board_generator = []; //2-dimensional array for storing original dice information
var current_track = []; // keep track of visited dice in selected order
var clickable = []; // those clickable dice
var submitted = new Set(); // store submitted words

/* Functions for generating the board */
function board(results) {//generate a random set of 36 dice and store them in board_generator
	var board = []; // For storing the dice
	var dice_arr = [];
	var upside;
	shuffle(board_generator);
	// console.log(`Newly-shuffled board board_generator`)
	// console.table(board_generator);
	for (let i = 0; i < board_generator.length; i++) {
		// console.log(`Looping through the board_generator`)
		// console.table(board_generator[i]);
		dice_arr = board_generator[i];
		upside = random_face(dice_arr);
		if (upside === 'Q') upside = 'QU';
		results.push(upside)
	}
	console.log("Board")
	console.table(board)
	console.log("results")
	console.log(results)
	//render board on HTML

}

function board_generate() {
	var dice;
	console.log(`List length: ${list.length}`)
	for (let i = 0; i < list.length; i++) {
		dice = list[i].toUpperCase().split('');
		board_generator.push(dice);
	}
	// console.table(board_generator);
}

function shuffle(arr) {//function to shuffle the dice
	var j, temp;
	for (let i = arr.length; i > 0; i--) {
		j = Math.floor(Math.random() * i);
		temp = arr[i - 1];
		arr[i - 1] = arr[j];
		arr[j] = temp;
	}
}

function random_face(arr) {//random a upside face from a dice
	var index = Math.floor(Math.random() * 6);
	var upside_face = arr[index];
	return upside_face;
}
var results = []
init()

board_generate();
board(results);
// button_event();

// The blueprint stores the shape of the board
var bluePrint = {
	"name": "Calendar Board",
	"description": "A calendar board",
	"author": "Calendar Board",
	"version": "1.0",
	"hexList": [
		{ "q": 0, "r": 0, "classes": "black" },
		{ "q": -1, "r": 0, "classes": "" },
		{ "q": -1, "r": 1, "classes": "" },
		{ "q": 0, "r": -1, "classes": "" },
		{ "q": 0, "r": 1, "classes": "" },
		{ "q": 1, "r": -1, "classes": "" },
		{ "q": 1, "r": 0, "classes": "" },
		{ "q": -2, "r": 0, "classes": "" },
		{ "q": -2, "r": 1, "classes": "" },
		{ "q": -2, "r": 2, "classes": "" },
		{ "q": -1, "r": -1, "classes": "" },
		{ "q": -1, "r": 2, "classes": "" },
		{ "q": 0, "r": -2, "classes": "" },
		{ "q": 0, "r": 2, "classes": "" },
		{ "q": 1, "r": -2, "classes": "" },
		{ "q": 1, "r": 1, "classes": "" },
		{ "q": 2, "r": -2, "classes": "" },
		{ "q": 2, "r": -1, "classes": "" },
		{ "q": 2, "r": 0, "classes": "" },
		{ "q": -3, "r": 0, "classes": "" },
		{ "q": -3, "r": 1, "classes": "" },
		{ "q": -3, "r": 2, "classes": "" },
		{ "q": -3, "r": 3, "classes": "" },
		{ "q": -2, "r": -1, "classes": "" },
		{ "q": -2, "r": 3, "classes": "" },
		{ "q": -1, "r": -2, "classes": "" },
		{ "q": -1, "r": 3, "classes": "" },
		{ "q": 0, "r": -3, "classes": "" },
		{ "q": 0, "r": 3, "classes": "" },
		{ "q": 1, "r": -3, "classes": "" },
		{ "q": 1, "r": 2, "classes": "" },
		{ "q": 2, "r": -3, "classes": "" },
		{ "q": 2, "r": 1, "classes": "" },
		{ "q": 3, "r": -3, "classes": "" },
		{ "q": 3, "r": -2, "classes": "" },
		{ "q": 3, "r": -1, "classes": "" },
		{ "q": 3, "r": 0, "classes": "" }
	]
}