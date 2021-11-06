// <> DOM Elements
const replaceMe = document.getElementById('replaceMe');

// Settings Variables and Constants
const verbose = false
const skipCenter = true
// const hexRadius = 50
var hexRadius
const separationMultiplier = 1.1
const textSize = 50
const textSpacingHeight = textSize*1.2
// <> Calculated global variables
// With pointy top, they’re at 30°, 90°, 150°, 210°, 270°, 330°
const cornerAngles = [30, 90, 150, 210, 270, 330]
// <> Initialized global variables
var Hexes = []
var gameBoard
var hexUID = 0
var ring = 0
var xCanvasSize
var xCanvasCenter
var yCanvasSize
var yCanvasCenter
var hexHeight
var hexWidth
var canvasSize
var canvasCenter
var viewportScale = 1
var attempts = 0
var firstload = true

// Gameplay global variables
const colors = ['orange', 'blue']
const players = [0, 1]
var currentPlayer = 0
var currentTurn = 1
var currentColor = colors[currentPlayer]
var wordHistory = []
var currentword = ""
var lastCLickedHex = null

// <> Class Definitions
class Coordinate2d { constructor(x, y) { this.x = x; this.y = y; } }

class Hex {
	constructor(q, r, classes) {
		// Initialize variables
		this.q = q
		this.r = r
		this.s = -q - r
		this.classes = `hex ${classes}`
		this.id = hexUID++
		// Find a way to check for duplicates
		// If a hex already exists at q,r, then don't create a new one
		// if (Hexes[q,r] != undefined) {
		// 	console.log(`Hex ${Hexes[q, r].id} already exists at ${q},${r}.\n[Attempt:${attempts++}]`)
		// 	return Hexes[q,r]
		// }
		// else {
		// Add this to the array
		Hexes[this.id] = this;
		debug(`Hex ${this.id} created at ${this.q},${this.r}.`)
		this.visual = []
		// Translate to center of hex
		this.center = this.hex_to_pixel(this)
		// }
	}
	announce() { console.log(`Hex ${this.id} created at (q:${this.q}, r:${this.r}, s:${this.s}), which is x:${this.center.x},y:${this.center.y}`) }

	lock() {
		// Mark the hex as locked
		this.classes = "hex locked"
		this.visual.attr('class', this.classes)
	}

	hex_to_pixel(h) {
		var r = h.r
		var q = h.q
		var x = (Math.sqrt(3.0) * q + Math.sqrt(3.0) / 2.0 * r) * hexRadius
		x = separationMultiplier * x
		var y = ((3 / 2) * r) * hexHeight / 2
		y = separationMultiplier * y
		return new Coordinate2d(x, y);
	}

	draw() {
		var polygonString = ""
		var presentationString = ""
		var xCenter = this.center.x
		var yCenter = this.center.y
		var x
		var y
		var id = this.id
		// Find the X and Y of each corner
		cornerAngles.forEach(element => {
			var theta = element * Math.PI / 180
			x = Math.floor(canvasCenter.x + xCenter + hexRadius * Math.cos(theta))
			y = Math.floor(canvasCenter.y + yCenter + hexRadius * Math.sin(theta))
			if (polygonString != "") { polygonString += " " }
			polygonString += `${x},${y}`
		});
		var onClickString = `Hex[${this.q},${this.r} clicked]`
		// Save all of the important attributes on the polygon, so they can be loaded later
		this.visual = gameBoard.polygon(polygonString)
			.stroke(`none`)
			.fill("#000")
			.attr('id', id)
			.attr('class', `hex ${this.classes}`)
			.attr('stroke-width', '2')
			.attr('stroke', '#000')
			.attr('q', this.q)
			.attr('r', this.r)
			// This method of setting onClick does not work
			// .attr('onClick', function () { console.log(`Clicked ${this.id}`) })
			// Do it this way instead
			.on('click', function () {
				debug(onClickString)
				handleClick(id);
			})
			// Thanks, Copilot!
			.attr('cursor', 'pointer')

		// If there is a letter, then draw it and make the hex clickable
		var currentLetter = this.letter
		if (currentLetter != undefined) {
			var displayLetter = gameBoard.text(currentLetter)
			displayLetter.fill('#040')
				.move(x - hexRadius, y)
				.font({
					family: 'monospace'
					, weight: 'bold'
					, size: 40
					, anchor: 'middle'
				})
				displayLetter.on('click', function () {
					debug(onClickString)
					handleClick(id);
				})
		} else { if (firstload) { console.log(`Hex ${this.id} has no letter.`) } }
		if (verbose) {
			presentationString += `${this.id}\n(${this.q},${this.r})`
			gameBoard.text(presentationString).fill('#fff').move(x - 1.5 * hexRadius, y - hexHeight / 2)
		}
	}

	isOrigin() {
		if(this.q == 0 && this.r == 0) {  return true }
		else { return false }
	}

	setClasses(classes) {
		this.classes = ""
		if (skipCenter == true && this.isOrigin()) {
			// Do nothing becuase the center should be blank
			this.classes = "hex locked black"
		} else {
			this.classes = `hex ${classes}`
			// this.visual.attr('class', `hex ${this.classes}`)
		}
	}

	isNeighbor(comparisonHex) {
		var foundNeighbor = false
		directionVectors.forEach(element => {
			if (this.q + element.q == comparisonHex.q && this.r + element.r == comparisonHex.r) { foundNeighbor = true }
		})
		return foundNeighbor
	}

	// var cube_direction_vectors = [
	// 	Cube(+1, 0, -1), Cube(+1, -1, 0), Cube(0, -1, +1), 
	// 	Cube(-1, 0, +1), Cube(-1, +1, 0), Cube(0, +1, -1), 
	// ]

	// function cube_direction(direction):
	// 	return cube_direction_vectors[direction]

	// function cube_add(hex, vec):
	// 	return Cube(hex.q + vec.q, hex.r + vec.q, hex.s + vec.s)

	// function cube_neighbor(cube, direction):
	// 	return cube_add(cube, cube_direction(direction))


} // End of class Hex

// <> Hex-altering Functions

function constructAllHexes() {
	for (i = 0; i < Hexes.length; i++) {
		var currentHex = Hexes[i];
		if (currentHex.isOrigin()) {
			console.log(`Creating origin`)
		} else {
			thisLetter = results.pop()
			currentHex.letter = thisLetter;
			console.log(`Assigning ${thisLetter} to hex ${currentHex.id}`)
			currentHex.setClasses("clickable")
			console.log(`Hex ${currentHex.id} has classes ${currentHex.classes}`)
		}
	}
}

function addTo(hexA, hexB) { return new Hex(hexA.q + hexB.q, hexA.r + hexB.r, hexA.s + hexB.s) }

// Store all of the q,r pairs in an array
var directionVectors = [
	{ "q": +1, "r": 0 }, { "q": +1, "r": -1 }, { "q": 0, "r": -1 }, { "q": -1, "r": 0 }, { "q": -1, "r": +1 }, { "q": 0, "r": +1 }
]

function refreshView() {
	gameBoard.clear()
	// Refresh the viewport
	// Draw all the hexes with their letters
	Hexes.forEach(element => { element.draw() })
	// Draw the current word
	drawCurrentWord()
	// Draw the history
	drawHistory()
}

function drawCurrentWord() {

	var wordObject = gameBoard.text(currentword)
	// .fill('#fff')
	// .move(canvasCenter.x - 1.5 * hexRadius, canvasCenter.y - hexHeight / 2)
	wordObject.text(currentword).fill(currentColor).stroke('#000')
		.move(textSpacingHeight, textSpacingHeight)
		.font({
			family: 'monospace'
			, weight: 'bold'
			, size: textSize
			, anchor: 'start'
		})
		.on('click', function () {
			endTurn()
		})
	console.log(`Current word: ${currentword}`)

}

function handleClick(hexId) {
	var clickedHex = Hexes[hexId]
	if (clickedHex.letter == undefined) {
		console.log(`Hex ${hexId} has no letter.`)
	} else {
		debug(`Hex ${hexId} clicked.`)
		debug(`Letter ${clickedHex.letter}`)
		// If the click is on a clickable hex, then add the letter to the current word
		console.log(clickedHex.classes)
		if (clickedHex.classes == "hex clickable") {
			// The hex has a letter and is clickable, so perform the action, so claim the hex for the current player
			successfulClick(clickedHex)
		}
	}
}

function successfulClick(clickedHex) {
	// Keep track of the letters so that you can rewind mistakes
	// !!!!! Still didnt do that

	// Remove the lastclick class from the other letter
	if (lastCLickedHex != null) { lastCLickedHex.setClasses(`${currentColor}`) }
	// Now update the new last clicked hex
	lastCLickedHex = clickedHex
	clickedHex.setClasses(`${currentColor} lastclick clickable`)
	// Add the letter to the word
	currentword += clickedHex.letter
	// Update the word display
	drawCurrentWord()

	Hexes.forEach(element => {
		if (element.classes.includes(currentColor)) {
			// Do nothing
		} else {
			if (clickedHex.isNeighbor(element)) {
				debug(`neighbor found at ${element.q}, ${element.r}`)
				element.setClasses(`clickable`)
			} else { element.setClasses(`locked`) }
		}
	})
	
	// Lock every hex that is not a neighbor of the clicked hex
	Hexes.forEach(element => {
		if (!clickedHex.isNeighbor(element)) {
		}
	})
	
	gameBoard.clear()
	refreshView()

	// // Check if the word is in the dictionary
	// if (dictionary.includes(current_word)) {
	// 	// The word is in the dictionary, so make the word display clickable in order to enter
	// }
	// else {
	// 	// The word is not in the dictionary, so do nothing
	// }
	// Lock all the neighbors
}

function endTurn() {
	console.log(`${currentTurn} The ${colors[currentPlayer]} player enterd ${currentword}`)
	wordHistory[currentTurn] = {"word": currentword, "color": currentColor}
	currentTurn++
	// Clear the current word
	currentword = ""
	// Switch the current player to the next player
	currentPlayer = (currentPlayer + 1) % players.length
	currentColor = colors[currentPlayer]
	// Clear the last clicked hex
	lastCLickedHex = null
	Hexes.forEach(element => { element.setClasses(`clickable`) })
	
	// Reset the board
	refreshView()
	drawCurrentWord()
}

function drawHistory() {
	// console.log(`Drawing history`)
	console.table(wordHistory)
	if(verbose) { console.table(wordHistory) }
	for (var i = 1; i < wordHistory.length; i++) {
		console.log(wordHistory[i])
		if(wordHistory[i] != null) {
			var element = gameBoard.text(wordHistory[i].word)
			console.log(`Drawing ${wordHistory[i].word} in ${wordHistory[i].color}`)
		element.fill(wordHistory[i].color)
		element.move(textSpacingHeight, yCanvasSize - textSpacingHeight * i).font({ family: 'monospace', weight: 'bold', size: textSize, anchor: 'start' })
		}
	}
}

// <> Helper Functions
function debug(string) { if (verbose) { console.log(string) } }

// <> Math Functions
function degtoRad(degrees) { return degrees * Math.PI / 180 }

function init() {
	// Determine the canvas size
	xCanvasSize = Math.floor(window.innerWidth * viewportScale)
	xCanvasCenter = Math.floor(xCanvasSize / 2)
	yCanvasSize = Math.floor(window.innerHeight * viewportScale)
	yCanvasCenter = Math.floor(yCanvasSize / 2)
	var minDimension = Math.min(xCanvasSize, yCanvasSize)
	hexRadius = minDimension / 14
	hexWidth = hexRadius * 2 * Math.cos(degtoRad(30))
	hexHeight = 2 * hexRadius
	// Create the SVG
	gameBoard = SVG().size(xCanvasSize, yCanvasSize).addTo(replaceMe)
	canvasCenter = new Coordinate2d(xCanvasCenter, yCanvasCenter)
	debug(`Canvas size is ${xCanvasSize} by ${yCanvasSize}`)
}

// <> Randomize the board
// Initialize stuff
var myDice1 = `rstqwx`
var myDice2 = `eaozjy`
var list = [
	'aaafrs', 'aaeeee', 'aafirs', 'adennn', 'aeeeem', myDice1,
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

// <> Main
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

// Run the constructor for each hex
bluePrint.hexList.forEach(function (hex) { new Hex(hex.q, hex.r, hex.classes) })
console.log(`results.length = ${results.length}`)
constructAllHexes()
// Now that the board is initialized, draw it for the first time
refreshView()
firstload = false
console.log(`Created ${Hexes.length} hexes`)