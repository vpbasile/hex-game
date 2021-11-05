const fs = require('fs');
const { stringify } = require('querystring');


console.log("Beginning")
var tempObject = {
	"name": "Calendar Board",
	"description": "A board with a 60-space perimeter",
	"hexes":[]
}
hexTable = []
// console.table(tempObject)

function grid(dimension) {
	for (var q = -dimension; q <= dimension; q++) {
		//     for each max(-dimension, -q-dimension) ≤ r ≤ min(+dimension, -q+dimension):
		for (var r = Math.max(-dimension, -q - dimension); r <= Math.min(dimension, -q + dimension); r++) {
			hexTable.push({"q":q, "r":r, "classes":"hex"})
		}
	}
}

grid(10)
// console.log(hexTable)
const objectOutput = JSON.stringify(hexTable, null, 2);
console.log(objectOutput)
fs.writeFileSync('hexTable.json', objectOutput);