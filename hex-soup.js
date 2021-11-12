function placeholderText() { return `It is ${players[currentPlayer].color}'s turn. Touch a letter to begin.` }

// Gameplay global variables
var players = [
	{ "id": 0, "color": "purple", "score": 0, "history": [] },
	{ "id": 1, "color": "blue", "score": 0, "history": [] }
]
var currentPlayer = 0
var currentTurn = 1
var currentColor = players[currentPlayer].color
var wordHistory = []
var currentword = ""
var currentWordScore = 0
var lastCLickedHex = null
var letterScores = {
	"A": 1, "B": 3, "C": 3, "D": 2, "E": 1, "F": 4, "G": 2, "H": 4, "I": 1, "J": 8, "K": 5, "L": 1, "M": 3, "N": 1, "O": 1, "P": 3, "QU": 10, "R": 1, "S": 1, "T": 1, "U": 1, "V": 4, "W": 4, "X": 8, "Y": 4, "Z": 10
}
var orientationBowl = 'flat-top'
var bowlRadius
var spoon = SVG().addTo('#gameBoard')
var spoonWord

function drawView() {
	// Refresh the viewport
	gameBoard.clear()
	// Draw a soup bowl 
	//then all the hexes with their letters
	// then the spoon
	drawSoupBowl()
	Hexes.forEach(element => { element.draw() })
	drawSpoon()
	// Draw the current word
	currentWordDisplay.innerText = `${currentword} (${currentWordScore})`
}

function drawSoupBowl() {
	var polygonString = ""
	var tempCoordinate = { "x": 0, "y": 0 }
	// Find the X and Y of each corner - shift the bowl by 60 degrees
	cornerAngles.forEach(element => {
		var theta = element * Math.PI / 180 + Math.PI / 6
		tempCoordinate.x = Math.floor(canvasCenter.x + bowlRadius * Math.cos(theta))
		tempCoordinate.y = Math.floor(canvasCenter.y + bowlRadius * Math.sin(theta))
		if (polygonString != "") { polygonString += " " }
		polygonString += `${tempCoordinate.x},${tempCoordinate.y}`
	});
	gameBoard.polygon(polygonString)
		.attr('id', 'bowl')
}

function drawSpoon() {
	var spoonPath = "m 226.47421,45.910526 c -5.37067,4.00346 -12.81036,7.02322 -20.78963,8.43847 -4.36103,0.77351 -14.70533,0.6148 -19.20723,-0.29467 -13.54124,-2.73561 -24.51445,-9.56608 -29.73114,-18.50665 -3.00716,-5.1538 -6.88048,-8.15267 -13.7684,-10.66003 -4.08853,-1.48831 -15.11075,-3.36464 -24.76726,-4.21618 -31.394691,-2.76843 -59.062171,3.49899 -84.907071,19.23371 -4.9198,2.99525 -8.19015,3.81279 -11.65472,2.91354 -2.62079,-0.68024 -4.97236,-3.08282 -6.08167,-6.2136 -0.94647,-2.67122 -1.11904,-7.55138 -0.37434,-10.58625 1.21771,-4.96258 4.47934,-9.4371 8.42133,-11.55297 2.15776,-1.15818 8.68752,-2.85717 19.00295,-4.9444098 34.83327,-7.048202 65.478881,-6.463439 95.007981,1.8129098 9.18012,2.57299 10.22532,2.77354 14.63147,2.80744 4.77078,0.0367 7.12111,-0.60396 10.023,-2.73211 12.36132,-9.0653828 34.54623,-11.22387584 52.87184,-5.1441898 8.4521,2.80404 16.32657,8.4068898 19.24461,13.6929098 4.8389,8.76566 1.80634,18.70051 -7.92171,25.95208 z m 1.77517,-10.90458 c -0.0557,-0.0556 -2.17265,0.4653 -4.70446,1.15765 -8.71468,2.3831 -17.19077,3.43591 -26.5419,3.29672 -10.26986,-0.15286 -18.85229,-1.63298 -28.601,-4.9325 -3.95062,-1.33711 -5.79018,-1.80335 -5.57234,-1.41231 2.43743,4.37534 10.21269,9.68378 17.91774,12.23306 13.99854,4.63152 30.0153,2.92082 40.99359,-4.37841 1.78941,-1.18974 6.74323,-5.72936 6.50837,-5.96421 z"
	// var enterText="enter"
	// var clearText="clear"
	gameBoard.path(spoonPath).move(400, 50).attr('id', 'spoon').transform({ scale: 3 }).fill("black").on('click', function () { finishTurn() })

	spoonWord = gameBoard.text(currentword).attr('class',`player${currentPlayer}`)
	spoonWord.move(650, 30)
		.on('click', function () { finishTurn() })
		.attr('id', 'submitButton')
		// .transform({ scale: 3 })
		// .fill("white")

	gameBoard.path(crackerPath).move(825,750).attr('id', 'crackers').transform({ scale: 20 }).stroke("none").attr('class',`pasta`).on('click', function() { clearTurn() })
	gameBoard.text("CLEAR").move(805,730).attr('id', 'crackersText').transform( { rotate: -45}).on('click', function() { clearTurn() })
}
function handleClick(hexId) {
	var clickedHex = Hexes[hexId]
	var hexLetter = clickedHex.letter
	console.log(`Clicked hex at q:${clickedHex.q} r:${clickedHex.r}`)
	switch (hexLetter) {
		case undefined:
			console.log(`Clicked empty hex`)
			break
		case 'enter':
			console.log(`Clicked enter`)
			finishTurn()
			break
		case 'clear':
			console.log(`Clicked clear`)
			clearTurn()
			break
		default:
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
	clickedHex.setClasses(`${currentColor} lastclick`)
	// Add the letter to the word
	currentLetter = clickedHex.letter
	currentword += currentLetter
	currentWordScore += letterScores[currentLetter]
	// Update the word display
	currentWordDisplay.innerText = currentword
	spoonWord.text(currentword)

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
	drawView()

	// // Check if the word is in the dictionary
	// if (dictionary.includes(current_word)) {
	// 	// The word is in the dictionary, so make the word display clickable in order to enter
	// }
	// else {
	// 	// The word is not in the dictionary, so do nothing
	// }
	// Lock all the neighbors
}

function appendToHistory(player, word) {
	// Add the word to the history
	players[player].history.push(word)
	// console.log(tempstring)
	var tempItem = document.createElement("li")
	tempItem.innerText = `${currentword}(${currentWordScore})`
	document.getElementById(`player${currentPlayer}history`).appendChild(tempItem)
	// Update the history display
	// drawHistory()
}

function finishTurn() {
	console.log(`${currentTurn} The ${players[currentPlayer].color} player enterd ${currentword} for ${currentWordScore} points.`)
	players[currentPlayer].score += currentWordScore
	var tempstring = `player${currentPlayer}score`
	document.getElementById(tempstring).innerText = players[currentPlayer].score
	// historyDisplay.innerHTML += `<li class="${currentColor}">(${currentWordScore})${currentword}</li>`
	appendToHistory(currentPlayer, currentword) // Add the word to the history
	wordHistory[currentTurn] = { "word": currentword, "color": currentColor }
	currentTurn++
	// Switch the current player to the next player
	currentPlayer = (currentPlayer + 1) % players.length
	currentWordDisplay.classList.toggle(currentColor)
	currentColor = players[currentPlayer].color
	spoonWord.attr('class',currentColor)
	currentWordDisplay.classList.toggle(currentColor)
	// Clear the current word

	currentWordDisplay.innerText = placeholderText()
	currentword = ""
	currentWordScore = 0
	// var scoreDisplayString =
	// 	`
	// <span class='${players[0].color} score'>${players[0].score}</span>
	// <span class='${players[1].color} score'>${players[1].score}</span>
	// `
	// Clear the last clicked hex
	lastCLickedHex = null
	Hexes.forEach(element => { element.setClasses(`clickable`) })
	clearTurn()
	// Reset the board
	// scoredisplay.innerHTML = scoreDisplayString
	drawView()
	currentWordDisplay.innerText = placeholderText()
}

function clearTurn() {
	// Clear the current word
	// currentWordDisplay.innerText = placeholderText
	currentword = ""
	currentWordScore = 0
	// Clear the last clicked hex
	lastCLickedHex = null
	Hexes.forEach(element => { element.setClasses(`clickable`) })

	// Reset the board
	drawView()
	// currentWordDisplay.innerText = placeholderText
}

function clearCurrentWord() {
	currentword = ""
	// currentWordDisplay.innerText = placeholderText()
}

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
	debug(`Board: ${board}`)
	debug(`Results: ${results}`)
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

// Make the enter button hex
var submitHex = new Hex(2, 2, "enter submit-button")
submitHex.letter = "enter"
// { "q": 2, "r": 2, "classes": "black" },

// Make the clear button hex
var clearHex = new Hex(4, -2, "clear")
clearHex.letter = "clear"