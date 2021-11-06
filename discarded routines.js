function spaceBoard() {
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
			new Hex(q, r, "green")
			results
		}
	}
} // End of grid()