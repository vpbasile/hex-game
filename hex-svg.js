// <> DOM Elements
const replaceMe = document.getElementById('replaceMe');

// Settings Variables and Constants
const verbose = false
const hexRadius = 50
const hexPadding = 5
// <> Calculated global variables
const hexWidth = hexRadius * 2 * Math.cos(degtoRad(30))
const hexHeight = 2 * hexRadius
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
var canvasSize
var canvasCenter
var viewportScale = 1
var attempts = 0

// <> Class Definitions
class Coordinate2d { constructor(x, y) { this.x = x; this.y = y; } }

class Hex {
	constructor(q, r, classes) {
		// if (Hexes[q,r] != undefined) {
		// 	console.log(`Hex ${Hexes[q, r].id} already exists at ${q},${r}.\n[Attempt:${attempts++}]`)
		// 	return Hexes[q,r]
		// }
		// else {
		// Initialize variables
		this.q = q
		this.r = r
		this.s = -q - r
		this.classes = classes
		this.id = hexUID++
		// Add this to the array
		Hexes[this.id] = this;
		console.log(`Hex ${this.id} created at ${this.q},${this.r}.`)
		this.visual = []
		// Translate to center of hex
		this.center = this.hex_to_pixel(this)
		// }
	}
	announce() { console.log(`Hex ${this.id} created at (q:${this.q}, r:${this.r}, s:${this.s}), which is x:${this.center.x},y:${this.center.y}`) }
	draw() {
		var polygonString = ""
		var presentationString = ""
		var xCenter = this.center.x
		var yCenter = this.center.y
		var x
		var y
		// Find the X and Y of each corner
		cornerAngles.forEach(element => {
			var theta = element * Math.PI / 180
			x = Math.floor(canvasCenter.x + xCenter + hexRadius * Math.cos(theta))
			y = Math.floor(canvasCenter.y + yCenter + hexRadius * Math.sin(theta))
			if (polygonString != "") { polygonString += " " }
			polygonString += `${x},${y}`
		});
		var onClickString = `Hex[${this.q},${this.r}]`
		// Save all of the important attributes on the polygon, so they can be loaded later
		this.visual = gameBoard.polygon(polygonString)
			.stroke(`none`)
			.fill("#000")
			.attr('id', this.id)
			.attr('class', `hex ${this.classes}`)
			.attr('stroke-width', '2')
			.attr('stroke', '#000')
			.attr('q', this.q)
			.attr('r', this.r)
			// This method of setting onClick does not work
			// .attr('onClick', function () { console.log(`Clicked ${this.id}`) })
			// Do it this way instead
			.on('click', function () { 
				console.log(onClickString); 
				// this.lock();
				updateHex(this.id);
			
			})
			// Thanks, Copilot!
			.attr('cursor', 'pointer')
		presentationString += `${this.id}\n(${this.q},${this.r})`
		if (verbose) { gameBoard.text(presentationString).fill('#fff').move(x - 1.5 * hexRadius, y) }
	}

	lock() {
		this.visual.attr('fill', '#000')
		this.visual.attr('stroke', '#000')
	}

	hex_to_pixel(h) {
		var size = hexWidth
		var xDirection 
		var yDirection
		var r = h.r
		var q = h.q
		var x = (Math.sqrt(3.0) * q + Math.sqrt(3.0) / 2.0 * r) * hexRadius
		x = 1.1 * x
		var y = ((3 / 2) * r) * hexHeight / 2
		y = 1.1 * y
		return new Coordinate2d(x, y);
	}

	
	click() { alert(`Hex ${this.id} clicked!`) }
	
} // End of class Hex

// <> Hex-altering Functions
function updateHex(hex) {
	hex.attr('class', `hex white`)
}

// <> Helper Functions
function pad(value, pad){
	if (value > 0) { return value + pad }
	if (value <= 0) { return value - pad }
	if (value == 0) { return 0 }
}

function degtoRad(degrees) { return degrees * Math.PI / 180 }

function diamond(radius, centerHex) {
	var temp
	for (var q = -radius; q <= radius; q++) {
		for (var r = -radius; r <= radius; r++) {
			if (q != r) { temp = new Hex(r + centerHex.q, q + centerHex.r, `hsl(220, 100%, 50%)`) }
			else { temp = new Hex(r + centerHex.q, q + centerHex.r, `hsl(40, 100%, 50%)`) }
		}
	}
}

function init() {
	// Determine the canvas size
	xCanvasSize = Math.floor(window.innerWidth * viewportScale)
	xCanvasCenter = Math.floor(xCanvasSize / 2)
	yCanvasSize = Math.floor(window.innerHeight * viewportScale)
	yCanvasCenter = Math.floor(yCanvasSize / 2)
	// Create the SVG
	gameBoard = SVG().size(xCanvasSize, yCanvasSize).addTo(replaceMe)
	canvasCenter = new Coordinate2d(xCanvasCenter, yCanvasCenter)
	console.log(`Canvas size is ${xCanvasSize} by ${yCanvasSize}`)
}

function spaceBoard() {

	// d	iamond(4, Hexes[0, 0])
	var temp
	// First ring
	ring = 1
	currentColor = `blue`
	temp = new Hex(-1, 0, currentColor)
	temp = new Hex(-1, 1, currentColor)
	temp = new Hex(0, -1, currentColor)
	temp = new Hex(0, 1, currentColor)
	temp = new Hex(1, -1, currentColor)
	temp = new Hex(1, 0, currentColor)
	console.log(Hexes, currentColor)
	// Second ring
	ring = 2
	currentColor = `yellow`
	temp = new Hex(-2, 0, currentColor)
	temp = new Hex(-2, 1, currentColor)
	temp = new Hex(-2, 2, currentColor)
	temp = new Hex(-1, -1, currentColor)
	temp = new Hex(-1, 2, currentColor)
	temp = new Hex(0, -2, currentColor)
	temp = new Hex(0, 2, currentColor)
	temp = new Hex(1, -2, currentColor)
	temp = new Hex(1, 1, currentColor)
	temp = new Hex(2, -2, currentColor)
	temp = new Hex(2, -1, currentColor)
	temp = new Hex(2, 0, currentColor)
	// Third ring
	ring = 3
	currentColor = `green`
	temp = new Hex(-3, 0, currentColor)
	temp = new Hex(-3, 1, currentColor)
	temp = new Hex(-3, 2, currentColor)
	temp = new Hex(-3, 3, currentColor)
	temp = new Hex(-2, -1, currentColor)
	temp = new Hex(-2, 3, currentColor)
	temp = new Hex(-1, -2, currentColor)
	temp = new Hex(-1, 3, currentColor)
	temp = new Hex(0, -3, currentColor)
	temp = new Hex(0, 3, currentColor)
	temp = new Hex(1, -3, currentColor)
	temp = new Hex(1, 2, currentColor)
	temp = new Hex(2, -3, currentColor)
	temp = new Hex(2, 1, currentColor)
	temp = new Hex(3, -3, currentColor)
	temp = new Hex(3, -2, currentColor)
	temp = new Hex(3, -1, currentColor)
	temp = new Hex(3, 0, currentColor)
} // End of spaceBoard()

function grid(dimension) {
	for (var q = -dimension; q <= dimension; q++) {
		//     for each max(-dimension, -q-dimension) ≤ r ≤ min(+dimension, -q+dimension):
		for (var r = Math.max(-dimension, -q - dimension); r <= Math.min(dimension, -q + dimension); r++) {
			var s = -q - r
			new Hex(q, r, "green")
			results
		}
	}
}

// <> Main
init()
// var origin = new Hex(0, 0, "blue")
// grid(10)

var results = []
// for each -dimension ≤ q ≤ +dimension:
var dimension = 10

var bluePrint = {
	"name": "Calendar Board",
	"description": "A calendar board",
	"author": "Calendar Board",
	"version": "1.0",
	"hexes": [
		{ "q": 0, "r": 0, "color": "black"},
		{ "q": -1, "r": 0, "color": "green"},
		{ "q": -1, "r": 1, "color": "green"},
		{ "q": 0, "r": -1, "color": "green"},
		{ "q": 0, "r": 1, "color": "green"},
		{ "q": 1, "r": -1, "color": "green"},
		{ "q": 1, "r": 0, "color": "green"},
		{ "q": -2, "r": 0, "color": "green"},
		{ "q": -2, "r": 1, "color": "green"},
		{ "q": -2, "r": 2, "color": "green"},
		{ "q": -1, "r": -1, "color": "green"},
		{ "q": -1, "r": 2, "color": "green"},
		{ "q": 0, "r": -2, "color": "green"},
		{ "q": 0, "r": 2, "color": "green"},
		{ "q": 1, "r": -2, "color": "green"},
		{ "q": 1, "r": 1, "color": "green"},
		{ "q": 2, "r": -2, "color": "green"},
		{ "q": 2, "r": -1, "color": "green"},
		{ "q": 2, "r": 0, "color": "green"},
		{ "q": -3, "r": 0, "color": "green"},
		{ "q": -3, "r": 1, "color": "green"},
		{ "q": -3, "r": 2, "color": "green"},
		{ "q": -3, "r": 3, "color": "green"},
		{ "q": -2, "r": -1, "color": "green"},
		{ "q": -2, "r": 3, "color": "green"},
		{ "q": -1, "r": -2, "color": "green"},
		{ "q": -1, "r": 3, "color": "green"},
		{ "q": 0, "r": -3, "color": "green"},
		{ "q": 0, "r": 3, "color": "green"},
		{ "q": 1, "r": -3, "color": "green"},
		{ "q": 1, "r": 2, "color": "green"},
		{ "q": 2, "r": -3, "color": "green"},
		{ "q": 2, "r": 1, "color": "green"},
		{ "q": 3, "r": -3, "color": "green"},
		{ "q": 3, "r": -2, "color": "green"},
		{ "q": 3, "r": -1, "color": "green"},
		{ "q": 3, "r": 0, "color": "green"}
	]
}

bluePrint.hexes.forEach(function(hex) { new Hex(hex.q, hex.r, hex.color) })

//         results.append(cube_add(center, Cube(q, r, s)))


// for (var r = -2; r <= 2; r++) {
// 	for (var q = -2; q <= 2; q++) {
// 		for (var s = -2; s <= 2; s++) {
// 			if (q + r + s == 0) { new Hex(q, r, "green") }
// 		}
// 	}
// }


Hexes.forEach(element => { element.draw() })
