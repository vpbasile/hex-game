// <!> To draw the hexes:
// Hexes.forEach(element => { element.draw() })

// <> DOM Elements
const replaceMe = document.getElementById('replaceMe');

// Settings Variables and Constants
const verbose = false
const hexRadius = 50
const hexPadding = 50
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

// <> Class Definitions
class Coordinate2d { constructor(x, y) { this.x = x; this.y = y; } }

class Hex {
	constructor(r, q, classes) {
		// Initialize variables
		if (Hexes[q, r] == undefined) {
			this.q = q
			this.r = r
			this.s = -q - r
			this.classes = classes
			this.id = hexUID++
			// Add this to the array
			Hexes[q, r] = this;
			console.log(`Hex ${this.id} created at ${this.q},${this.r}.`)
			this.visual = []
			// Translate to center of hex
			this.center = this.hex_to_pixel(this)
		} else { console.log(`Hex ${Hexes[q,r].id} already exists at ${q},${r}.`) }
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
		this.visual = gameBoard.polygon(polygonString)
			.stroke(`none`)
			.fill("#000")
			.attr('id', this.id)
			.attr('class', `hex ${this.classes}`)
			.attr('stroke-width', '2')
			.attr('stroke', '#000')
			// This method of setting onClick does not work
			// .attr('onClick', function () { console.log(`Clicked ${this.id}`) })
			// Do it this way instead
			.on('click', function () { console.log(onClickString); })
			// Thanks, Copilot!
			.attr('cursor', 'pointer')
		presentationString += `${this.id}\n(${this.q},${this.r})`
		if (verbose) { gameBoard.text(presentationString).fill('#fff').move(x - 1.5 * hexRadius, y) }
	}

	hex_to_pixel(h) {
		var size = hexWidth
		var r = h.r
		var q = h.q
		var x = (Math.sqrt(3.0) * q + Math.sqrt(3.0) / 2.0 * r) * hexRadius + hexPadding;
		var y = ((3 / 2) * r) * hexHeight / 2 + hexPadding;
		return new Coordinate2d(x, y);
	}

	click() { alert(`Hex ${this.id} clicked!`) }

} // End of class Hex

// <> Helper Functions
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
	diamond(4, Hexes[0, 0])

	var temp
	// First ring
	ring = 1
	currentColor = `#003`
	temp = new Hex(-1, 0)
	temp = new Hex(-1, 1)
	temp = new Hex(0, -1)
	temp = new Hex(0, 1)
	temp = new Hex(1, -1)
	temp = new Hex(1, 0)
	console.log(Hexes)
	// Second ring
	ring = 2
	currentColor = `#006`
	temp = new Hex(-2, 0)
	temp = new Hex(-2, 1)
	temp = new Hex(-2, 2)
	temp = new Hex(-1, -1)
	temp = new Hex(-1, 2)
	temp = new Hex(0, -2)
	temp = new Hex(0, 2)
	temp = new Hex(1, -2)
	temp = new Hex(1, 1)
	temp = new Hex(2, -2)
	temp = new Hex(2, -1)
	temp = new Hex(2, 0)
	// Third ring
	ring = 3
	currentColor = `#009`
	temp = new Hex(-3, 0)
	temp = new Hex(-3, 1)
	temp = new Hex(-3, 2)
	temp = new Hex(-3, 3)
	temp = new Hex(-2, -1)
	temp = new Hex(-2, 3)
	temp = new Hex(-1, -2)
	temp = new Hex(-1, 3)
	temp = new Hex(0, -3)
	temp = new Hex(0, 3)
	temp = new Hex(1, -3)
	temp = new Hex(1, 2)
	temp = new Hex(2, -3)
	temp = new Hex(2, 1)
	temp = new Hex(3, -3)
	temp = new Hex(3, -2)
	temp = new Hex(3, -1)
	temp = new Hex(3, 0)
} // End of spaceBoard()

function grid(dimension) {
	for (var r = -dimension; r <= dimension; r++) {
		for (var q = -dimension; q <= dimension; q++) {
			Hexes[q, r] = new Hex(q, r);
		}
	}
}


// <> Main
init()
var origin = new Hex(0, 0, "blue")
var other = new Hex(1, 1, "red")
new Hex(1,1)

Hexes.forEach(element => { element.draw() })
