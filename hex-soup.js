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
	var tempCoordinate = {"x": 0, "y": 0}
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
	var d="m 142.769,-71.941154 c 4.00346,5.370674 7.02322,12.810364 8.43847,20.789632 0.77351,4.361032 0.6148,14.705332 -0.29467,19.207233 -2.73561,13.541237 -9.56608,24.5144453 -18.50665,29.7311397 -5.1538,3.00716228 -8.15267,6.8804813 -10.66003,13.7684013 -1.48831,4.088527 -3.36464,15.110745 -4.21618,24.767257 -2.76843,31.394691 3.49899,59.062171 19.23371,84.907071 2.99525,4.9198 3.81279,8.19015 2.91354,11.65472 -0.68024,2.62079 -3.08282,4.97236 -6.2136,6.08167 -2.67122,0.94647 -7.55138,1.11904 -10.58625,0.37434 -4.96258,-1.21771 -9.4371,-4.47934 -11.55297,-8.42133 -1.15818,-2.15776 -2.85717,-8.68752 -4.94441,-19.00295 -7.048202,-34.83327 -6.463439,-65.478882 1.81291,-95.00798 2.57299,-9.1801196 2.77354,-10.2253225 2.80744,-14.6314745 0.0367,-4.7707717 -0.60396,-7.1211027 -2.73211,-10.0229982 -9.065383,-12.3613223 -11.223876,-34.5462253 -5.14419,-52.8718373 2.80404,-8.452104 8.40689,-16.326573 13.69291,-19.244611 8.76566,-4.838895 18.70051,-1.80634 25.95208,7.92171 z m -10.90458,-1.77517 c -0.0556,0.05565 0.4653,2.172649 1.15765,4.704466 2.3831,8.714681 3.43591,17.190763 3.29672,26.541896 -0.15286,10.269863 -1.63298,18.852287 -4.9325,28.601006 -1.33711,3.9506194 -1.80335,5.7901719 -1.41231,5.5723335 4.37534,-2.4374325 9.68378,-10.2126865 12.23306,-17.9177395 4.63152,-13.998536 2.92082,-30.015297 -4.37841,-40.993589 -1.18974,-1.789411 -5.72936,-6.743225 -5.96421,-6.508373 z"
	gameBoard.path(d).move(100,400).attr('id', 'spoon').transform({ scale:3}).fill("black").on('click', function() { finishTurn() })
	// gameBoard.text(100,100, "Spoon").attr('id','spoonText')
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
	submitButton.classList.toggle(currentColor)
	currentWordDisplay.classList.toggle(currentColor)
	currentColor = players[currentPlayer].color
	submitButton.classList.toggle(currentColor)
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