// <> Main

// <> Randomize the board
// Initialize stuff
var myDice1 = `rstqwx`
var myDice2 = `eaozjy`
var list = [
	'aaafrs', 'aaeeee', 'aafirs', 'adennn', 'aeeeem', myDice1,
	'aeegmu', 'aegmnn', 'afirsy', 'bjkqxz', 'ccenst', myDice2,
	'aeegmu', 'aegmnn', 'afirsy', 'bjkqxz', 'ccenst', myDice2,
	'ceiilt', 'ceilpt', 'ceipst', 'ddhnot', 'dhhlor', myDice1,
	'dhlnor', 'dhlnor', 'eiiitt', 'emottt', 'ensssu', myDice2,
	'fiprsy', 'gorrvw', 'iprrry', 'nootuw', 'ooottu', myDice1
	, 'ceilpt', 'ceipst', 'ddhnot', 'dhhlor', myDice2, myDice1
]

var board_generator = []; //2-dimensional array for storing original dice information
var current_track = []; // keep track of visited dice in selected order
var clickable = []; // those clickable dice
var submitted = new Set(); // store submitted words

var results = []
initCanvas()

function generateLetters() {

	board_generate();
	board(results);
}
generateLetters()

// The blueprint stores the shape of the board
var bluePrint = {
	"name": "Bee Spelling Board",
	"description": "A bee spelling board",
	"author": "Vincent",
	"version": "1.0",
	"hexList": [
		{ "q": 0, "r": 0, "classes": "" },
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

// Run the constructor for each hex
bluePrint.hexList.forEach(function (hex) { new Hex(hex.q, hex.r, hex.classes) })

constructAllHexes()

// Now that the board is initialized, draw it for the first time
drawView()
firstload = false
console.log(`Created ${Hexes.length} hexes`)
currentWordDisplay.classList.toggle(currentColor)
currentWordDisplay.innerText = placeholderText()
document.getElementById("player0history").innerText = "-"
document.getElementById('player1history').innerText = "-"
beginTurn()