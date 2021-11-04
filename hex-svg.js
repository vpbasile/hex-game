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
	constructor(r, q, colorString) {
		// Initialize variables
		this.q = q
		this.r = r
		this.s = -q - r
		// if (Hexes[this.q, this.r] == undefined) {
			this.color = colorString
			this.id = hexUID++
			this.visual = []
			// Translate to center of hex
			var x = this.q * hexWidth
			var y = this.r * hexRadius * Math.sin(degtoRad(60))
			this.center = this.hex_to_pixel(this)
			// this.announce()
			// If Hexes[q,r] doesn't exist, create it
			Hexes[this.id] = this
			console.log(`Hex ${this.id} created at ${this.q},${this.r}.`)
		// } else { console.log('Hex already exists at q: ' + this.q + ', r: ' + this.r) }
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
		// console.log(polygonString)
		this.visual = gameBoard.polygon(polygonString)
			.stroke(`#fff`)
			.fill(this.color)
			.attr('id', this.id)
			.attr('class', 'hex')
			.attr('stroke-width', '2')
		this.visual.attr('id', this.id)
		this.visual.attr('class', 'hex')
		this.visual.className = 'test'
		this.visual.id = this.id
		this.visual.style.cursor = 'pointer'
		this.visual.onclick = function () { this.click }
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

// <> Main
init()
// Create the hexes
// Draw things
// center
ring = 0
var currentColor = `hsl(40, 100%, 50%)`
origin = new Hex(0, 0, currentColor)

diamond(4, Hexes[0, 0])

var temp
// First ring
ring = 1
currentColor = `#003`
temp = new Hex(-1, 0, currentColor)
temp = new Hex(-1, 1, currentColor)
temp = new Hex(0, -1, currentColor)
temp = new Hex(0, 1, currentColor)
temp = new Hex(1, -1, currentColor)
temp = new Hex(1, 0, currentColor)
console.log(Hexes)
// Second ring
ring = 2
currentColor = `#006`
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
currentColor = `#009`
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

// Draw the hexes
Hexes.forEach(element => { element.draw() })
// SVG.on(`click`, () => { console.log(`Click`) })


