// <> DOM Elements
const replaceGameBoard = document.getElementById('gameBoard');
const historyDisplay = document.getElementById('historyList')
const submitButton = document.getElementById("submitButton")
const currentWordDisplay = document.getElementById('currentWordDisplay')
const player0scoredisplay = document.getElementById('player0scoredisplay')

// Settings Variables and Constants
const backgroundColor = '#000'
const verbose = false
const skipCenter = false
// const hexRadius = 50
var hexRadius
const separationMultiplier = 1.1
const textSize = 50
const textSpacingHeight = textSize * 1.2
// <> Calculated global variables
// With pointy top, they’re at 30°, 90°, 150°, 210°, 270°, 330°
const cornerAngles = [30, 90, 150, 210, 270, 330]
// <> Initialized global variables
var Hexes = []
var hexSize = { "x": "", "y": "" }
var hexUID = 0
var ring = 0
var canvasSize
var canvasCenter = { "x": "", "y": "" }
var viewportScale = 0.5
var attempts = 0
var firstload = true
var orientationScreen
var orientationHex = "pointy-top"
var gameBoard

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
		var y = ((3 / 2) * r) * hexSize.y / 2
		y = separationMultiplier * y
		return new Coordinate2d(x, y);
	}

	draw() {
		var polygonString = ""
		var presentationString = ""
		var hexCenter = this.hex_to_pixel(this)
		var tempCoordinate = new Coordinate2d(0, 0)
		var id = this.id
		// Find the X and Y of each corner
		cornerAngles.forEach(element => {
			var theta = element * Math.PI / 180
			tempCoordinate.x = Math.floor(canvasCenter.x + this.center.x + hexRadius * Math.cos(theta))
			tempCoordinate.y = Math.floor(canvasCenter.y + this.center.y + hexRadius * Math.sin(theta))
			if (polygonString != "") { polygonString += " " }
			polygonString += `${tempCoordinate.x},${tempCoordinate.y}`
		});
		var onClickString = `Hex[${this.q},${this.r} clicked]`
		// Save all of the important attributes on the polygon, so they can be loaded later
		this.visual = gameBoard.polygon(polygonString)
			.stroke(`none`)
			.fill("#000")
			.attr('id', id)
			.attr('class', `${this.classes}`)
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
		// If currentlter, then make it clickable
		if (currentLetter == 'enter') {
			gameBoard.fill(`white`)
				.move(canvasCenter.x + this.center.x, canvasCenter.y + this.center.y - hexSize.y / 5)
				.font({
					family: 'monospace'
					, weight: 'bold'
					, size: 40
					, anchor: 'middle'
				})

		}
		if (currentLetter != undefined) {
			var displayLetter = gameBoard.text(currentLetter)
			displayLetter
				// .attr('class', `${this.classes}`)
				.fill(`white`)
				.move(canvasCenter.x + this.center.x, canvasCenter.y + this.center.y - hexSize.y / 5)
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
			// presentationString += `${this.id}\n(${this.q},${this.r})`
			// gameBoard.text(presentationString).fill('#fff').move(x - 1.5 * hexRadius, y - hexSize.y / 2)
		}
	}

	isOrigin() {
		if (this.q == 0 && this.r == 0) { return true }
		else { return false }
	}

	setClasses(classes) {
		this.classes = ""
		if (skipCenter == true && this.isOrigin() == 444444) {
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

	assignLetter() {
		var thisLetter = results.pop()
		this.letter = thisLetter;
		debug(`Assigning ${thisLetter} to hex ${this.id}`)
		this.setClasses("clickable")
		debug(`Hex ${this.id} has classes ${this.classes}`)
	}
} // End of class Hex

// <> Hex-altering Functions

function constructAllHexes() {
	// Make the grid of hexes
	for (i = 0; i < Hexes.length; i++) {
		Hexes[i].assignLetter()
	}
}


function initCanvas() {
	// Determine the canvas size
	var fudgeFactor = 1.2
	canvasSize = {
		"x": Math.floor(window.innerWidth),
		"y": Math.floor(window.innerHeight)
	}
	if (canvasSize.x > canvasSize.y) { orientationScreen = "landscape" }
	else { orientationScreen = "portrait" }
	console.log(`${orientationScreen} screen`)
	var minDimension = Math.min(canvasSize.x, canvasSize.y)
	canvasSize.x = minDimension
	canvasSize.y = minDimension
	canvasCenter.x = Math.floor(canvasSize.x / 2)
	canvasCenter.y = Math.floor(canvasSize.y / 2)
	hexRadius = minDimension / (14 * fudgeFactor)
	hexSize.x = hexRadius * 2 * Math.cos(degtoRad(30))
	hexSize.y = 2 * hexRadius
	// Create the SVG
	// Actually, we need a little more space for the bowl, so we'll make the canvas a little wider
	canvasSize.x += 60
	canvasCenter.x = Math.floor(canvasSize.x / 2)
	gameBoard = SVG().size(canvasSize.x, canvasSize.y).addTo(replaceGameBoard)
	// canvasCenter = new Coordinate2d(canvasCenter.x, canvasCenter.y)
	debug(`Canvas size is ${canvasSize.x} by ${canvasSize.y}`)
	bowlRadius = (Math.min(canvasSize.x, canvasSize.y) / 2)*0.95
}

// <> Helper and Math Functions
function debug(string) { if (verbose) { console.log(string) } }
function degtoRad(degrees) { return degrees * Math.PI / 180 }
function addTo(hexA, hexB) { return new Hex(hexA.q + hexB.q, hexA.r + hexB.r, hexA.s + hexB.s) }

// Store all of the q,r directiom vector pairs in an array
var directionVectors = [
	{ "q": +1, "r": 0 }, { "q": +1, "r": -1 }, { "q": 0, "r": -1 }, { "q": -1, "r": 0 }, { "q": -1, "r": +1 }, { "q": 0, "r": +1 }
]